package com.search.controller;

import com.search.dao.UserDao;
import com.search.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Administrator on 2017/6/7.
 */

@RestController
@RequestMapping("search")
public class SearchController {

    @Autowired
    private UserDao userDao;

    @RequestMapping("findAll")
    private List<User> findAll(){
        return userDao.findAll();
    }
}
