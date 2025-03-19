package com.example.chatapp.Entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;  // Changed to link to User

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;  // Added receiver to link to User

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date timestamp = new Date(System.currentTimeMillis());

    @Column(nullable = false)
    private String content;  // Changed from "replyMessage" to "content"

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

}
