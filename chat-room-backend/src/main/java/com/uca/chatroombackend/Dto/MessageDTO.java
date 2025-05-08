package com.uca.chatroombackend.Dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private String sender;
    private String content;
    private String timestamp;
}

