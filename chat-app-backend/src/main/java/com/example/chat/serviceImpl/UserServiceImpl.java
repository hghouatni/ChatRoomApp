package com.example.chat.serviceImpl;

import com.example.chat.POJO.User;
import com.example.chat.constents.ChatConstents;
import com.example.chat.dao.UserDao;
import com.example.chat.service.UserService;
import com.example.chat.utils.ChatUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;

@Slf4j
@Service

public class UserServiceImpl implements UserService {
    @Autowired
    UserDao userDao;

    @Override
    public ResponseEntity<String> signUp(Map<String, String> requestMap) {
            log.info("Inside sign up {}",requestMap);
            try {
                if (validaSignUpMap(requestMap)) {
                    User user = userDao.findByEmailId(requestMap.get("email"));
                    if (Objects.isNull(user)) {
                        userDao.save(getUserFromMap(requestMap));
                        //System.out.println("Successfully  Registered.");
                        return ChatUtils.getResponeEntity("Successfully  Registered.", HttpStatus.OK);
                    } else {
                        return ChatUtils.getResponeEntity("Email already exits.", HttpStatus.BAD_REQUEST);
                    }

                } else {
                    return ChatUtils.getResponeEntity(ChatConstents.INVALID_DATA, HttpStatus.BAD_REQUEST);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
            return ChatUtils.getResponeEntity(ChatConstents.SOMETHING_WENT_WRONG,HttpStatus.INTERNAL_SERVER_ERROR);

    }
    private boolean validaSignUpMap(Map<String, String> requestMap) {
        if (requestMap.containsKey("name")  && requestMap.containsKey("email") && requestMap.containsKey("password")) {
            return true;
        }
        return false;
    }
    private User getUserFromMap(Map<String, String> requestMap) {
        User user = new User();
        user.setName(requestMap.get("name"));
        user.setEmail(requestMap.get("email"));
        user.setPassword(requestMap.get("password"));
        user.setStatus(requestMap.get("  "));
        return user;
    }
}

