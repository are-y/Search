package com.search.dao;

import com.search.entity.User;

import java.util.List;

/**
 * Created by Administrator on 2017/6/7.
 */
public interface UserDao {
    public  void  saveUser(User user);

    public List<User> findAll();
}
