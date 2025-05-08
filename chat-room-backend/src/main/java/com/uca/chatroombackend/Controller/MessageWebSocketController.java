package com.uca.chatroombackend.Controller;

import com.uca.chatroombackend.Dto.MessageDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageWebSocketController {

    @MessageMapping("/send")            // Envoi via /app/send
    @SendTo("/topic/messages")          // Diffusé à tous les abonnés à /topic/messages
    public MessageDTO sendMessage(MessageDTO message) {
        return message;
    }
}

