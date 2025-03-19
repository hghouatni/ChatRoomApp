package com.example.chatapp.Service.Chat;

import com.example.chatapp.Dto.ChatRequest;
import com.example.chatapp.Entity.Chat;
import com.example.chatapp.Entity.Message;
import com.example.chatapp.Entity.User;
import com.example.chatapp.Repository.ChatRepository;
import com.example.chatapp.Repository.MessageRepository;
import com.example.chatapp.Repository.UserRepository;

import com.example.chatapp.Service.Authentication.UserService;
import com.example.chatapp.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    private final UserService userService;

    public ChatService(UserService userService) {
        this.userService = userService;
    }

    public Chat createChat(ChatRequest chatRequest) {
        // Validate the user IDs (ensure they are not null)
        if (chatRequest.getUser1Id() == null || chatRequest.getUser2Id() == null) {
            throw new IllegalArgumentException("User IDs must not be null");
        }

        // Fetch users by their IDs
        User user1 = userService.getUserById(chatRequest.getUser1Id());
        User user2 = userService.getUserById(chatRequest.getUser2Id());

        // Check if both users exist
        if (user1 == null || user2 == null) {
            throw new IllegalArgumentException("One or both users not found");
        }

        Optional<Chat> existingChat = chatRepository.findByFirstUserAndSecondUser(user1, user2);
        Optional<Chat> existingChat2 = chatRepository.findByFirstUserAndSecondUser(user2, user1);
        if (existingChat.isPresent() || existingChat2.isPresent()) {
            return existingChat.orElseGet(existingChat2::get);
        }

        Chat chat = new Chat(user1, user2);

        return chatRepository.save(chat);
    }

    public Message addMessage(Message message, int chatId) throws ChatNotFoundException {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat not found"));

        message.setChat(chat);
        messageRepository.save(message);

        chat.getMessageList().add(message);
        chatRepository.save(chat);
        return message;
    }

    public List<Chat> findAllChats() throws ChatNotFoundException {
        List<Chat> chats = chatRepository.findAll();
        if (chats.isEmpty()) {
            throw new ChatNotFoundException("No chats found in the repository");
        }
        return chats;
    }

    public Chat getById(int chatId) throws ChatNotFoundException {
        return chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat not found"));
    }

    public List<Chat> getChatsByUser(String username) throws ChatNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ChatNotFoundException("User not found"));

        List<Chat> chats = chatRepository.findByFirstUserOrSecondUser(user, user);
        if (chats.isEmpty()) {
            throw new ChatNotFoundException("No chats found");
        }
        return chats;
    }

    public Chat getChatBetweenUsers(Long firstUserId, Long secondUserId) throws ChatNotFoundException {
        return chatRepository.findChatBetweenUsers(firstUserId, secondUserId)
                .orElseThrow(() -> new ChatNotFoundException("No conversation found between the users"));
    }
}
