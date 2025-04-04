package com.uca.chatroombackend.Repository;


import com.uca.chatroombackend.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);

    @Override
    Page<User> findAll(Pageable pageable);

    Optional<User> findByUsername(String username);
}
