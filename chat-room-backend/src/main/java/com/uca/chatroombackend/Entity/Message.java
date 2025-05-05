package com.uca.chatroombackend.Entity;

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
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "datetime")
    private Date timestamp = new Date(System.currentTimeMillis());

    @Column(nullable = false)
    private String content;

    @Column(name = "message_type")
    private String type = "text";

    @Column(name = "media_url")
    private String mediaUrl;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;
}