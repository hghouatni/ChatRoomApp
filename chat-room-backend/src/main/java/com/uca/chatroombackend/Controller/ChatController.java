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
import com.uca.chatroombackend.Service.Media.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor



@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MediaService mediaService;

    @Autowired
    private UserService userService;

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

    @PostMapping("/media/{chatId}")
    public ResponseEntity<Map<String, Object>> uploadMedia(
            @PathVariable int chatId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("senderId") Long senderId,
            @RequestParam("receiverId") Long receiverId,
            @RequestParam("timestamp") String timestampStr,
            @RequestParam("type") String type) {

        try {
            // Parse timestamp
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            Date timestamp = format.parse(timestampStr);

            // Store the file and get its URL
            String mediaUrl = mediaService.storeFile(file, type);

            // Create message entity
            Message message = new Message();
            User sender = userService.getUserById(senderId);
            User receiver = userService.getUserById(receiverId);

            message.setSender(sender);
            message.setReceiver(receiver);
            message.setTimestamp(timestamp);
            message.setType(type);
            message.setMediaUrl(mediaUrl);

            // Set appropriate content based on type
            if ("image".equals(type)) {
                message.setContent("Image");
            } else if ("audio".equals(type)) {
                message.setContent("Audio message");
            }

            // Add message to chat
            Message savedMessage = chatService.addMessage(message, chatId);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedMessage.getId());
            response.put("content", savedMessage.getContent());
            response.put("timestamp", savedMessage.getTimestamp());
            response.put("type", savedMessage.getType());
            response.put("sender", savedMessage.getSender());
            response.put("mediaUrl", savedMessage.getMediaUrl());

            return ResponseEntity.ok(response);
        } catch (ChatNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        } catch (ParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid timestamp format: " + e.getMessage()));
        }
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