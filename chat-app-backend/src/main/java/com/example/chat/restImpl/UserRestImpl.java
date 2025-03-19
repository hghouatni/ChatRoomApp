package com.example.chat.restImpl;

import com.example.chat.constents.ChatConstents;
import com.example.chat.rest.UserRest;
import com.example.chat.service.UserService;
import com.example.chat.utils.ChatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class UserRestImpl implements UserRest {
    @Autowired //injection des dépandance pour utiliser user service
    UserService userService ;
    @Override
    public ResponseEntity<String> signUp(Map<String, String> requestMap) {
        try {
            //System.out.println("inside userRestImpl");
            return userService.signUp(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return ChatUtils.getResponeEntity(ChatConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
