package com.uca.chatroombackend.Controller;


import com.uca.chatroombackend.Dto.ChatRequest;
import com.uca.chatroombackend.Dto.MessageRequest;
import com.uca.chatroombackend.Entity.Chat;
import com.uca.chatroombackend.Entity.Message;
import com.uca.chatroombackend.Entity.User;
import com.uca.chatroombackend.Exception.ChatNotFoundException;
import com.uca.chatroombackend.Exception.UserNotFoundException;
import com.uca.chatroombackend.Repository.UserRepository;
import com.uca.chatroombackend.Service.Authentication.UserService;
import com.uca.chatroombackend.Service.Chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ChatController(UserService userService, ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/createChat")
    public ResponseEntity<?> createChat(@RequestBody ChatRequest chatRequest) {
        try {
            Chat createdChat = chatService.createChat(chatRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdChat);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<Chat>> getAllChats() {
        try {
            return new ResponseEntity<List<Chat>>(chatService.findAllChats(), HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity("List not found", HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chat> getChatById(@PathVariable int id) {
        try {
            return new ResponseEntity<Chat>(chatService.getById(id), HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity("Chat Not Found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/message/{chatId}")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest messageRequest, @PathVariable int chatId) throws ChatNotFoundException, UserNotFoundException {
        // Process message
        User sender = userRepository.findById(messageRequest.getSenderId())
                .orElseThrow(() -> new UserNotFoundException("Sender user not found"));

        User receiver = userRepository.findById(messageRequest.getReceiverId())
                .orElseThrow(() -> new UserNotFoundException("Receiver user not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(messageRequest.getContent());
        message.setTimestamp(messageRequest.getTimestamp() != null ? messageRequest.getTimestamp() : new Date());

        // Save the message
        Message savedMessage = chatService.addMessage(message, chatId);

        // Return HTTP response
        return new ResponseEntity<>(savedMessage, HttpStatus.OK);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Chat>> getChatsByUser(@PathVariable String username) {
        try {
            return new ResponseEntity<List<Chat>>(chatService.getChatsByUser(username), HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity("No chats found for this user", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/conversation/{firstUserId}/{secondUserId}")
    public ResponseEntity<?> getChatBetweenUsers(@PathVariable Long firstUserId, @PathVariable Long secondUserId) {
        try {
            Chat chat = chatService.getChatBetweenUsers(firstUserId, secondUserId);
            return ResponseEntity.ok(chat);
        } catch (ChatNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No conversation found");
        }
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageRequest messageRequest) throws UserNotFoundException {
        // Create a message object but don't save it to the database
        User sender = userRepository.findById(messageRequest.getSenderId())
                .orElseThrow(() -> new UserNotFoundException("Sender user not found"));

        User receiver = userRepository.findById(messageRequest.getReceiverId())
                .orElseThrow(() -> new UserNotFoundException("Receiver user not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(messageRequest.getContent());
        message.setTimestamp(messageRequest.getTimestamp() != null ? messageRequest.getTimestamp() : new Date());

        // Send the message to the receiver over WebSocket
        messagingTemplate.convertAndSend(
                "/queue/messages/" + receiver.getId(),  // Queue that the receiver listens to
                message
        );
    }

}
