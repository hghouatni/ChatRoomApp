package com.uca.chatroombackend.Repository;

import com.uca.chatroombackend.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByChat_ChatId(int chatId);

    List<Message> findBySender_Email(String senderEmail);

    List<Message> findByReceiver_Email(String receiverEmail);

    List<Message> findBySender_EmailAndReceiver_EmailAndChat_ChatId(String senderEmail, String receiverEmail, int chatId);

}