package com.search.controller;

import com.search.dao.UserDao;
import com.search.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 * Created by Nash
 * on 2017-06-08 .
 */
@RequestMapping("alter")
public class AlterController {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "saveUser",method = RequestMethod.POST)
    private  void  save(@RequestBody User user){
        userDao.saveUser(user);
    }
}
