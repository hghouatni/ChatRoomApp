package com.example.chatapp.Repository;

import com.example.chatapp.Entity.Chat;
import com.example.chatapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {

    Optional<Chat> findById(int chatId);

    Optional<Chat> findByFirstUserAndSecondUser(User firstUser, User secondUser);

    List<Chat> findByFirstUserOrSecondUser(User firstUser, User secondUser);

    Optional<Chat> findByFirstUserIdAndSecondUserId(Long firstUserId, Long secondUserId);

    List<Chat> findByFirstUser_Username(String username);

    List<Chat> findBySecondUser_Username(String username);

    // Check if a chat already exists between two users
    boolean existsByFirstUserAndSecondUser(User firstUser, User secondUser);

    default Optional<Chat> findChatBetweenUsers(Long userId1, Long userId2) {
        return findByFirstUserIdAndSecondUserId(userId1, userId2)
                .or(() -> findByFirstUserIdAndSecondUserId(userId2, userId1));
    }
}
