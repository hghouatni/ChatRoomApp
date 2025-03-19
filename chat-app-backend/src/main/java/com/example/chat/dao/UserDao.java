package com.example.chat.dao;

import com.example.chat.POJO.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserDao extends JpaRepository<User,Integer> {

    User findByEmailId(@Param("email") String email);





}
