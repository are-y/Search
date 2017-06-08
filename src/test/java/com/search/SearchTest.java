package com.search;


import ch.qos.logback.core.net.SyslogOutputStream;
import com.search.dao.UserDao;
import com.search.entity.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

/**
 * Created by Administrator on 2017/6/7.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class SearchTest {

    @Autowired
    private UserDao userDao;

    @Test
    public  void save(){
//        User user=new User(6L,"nash","465465","nash","WX");
        User user=new User();
        user.setId(8L);
        user.setEmail("nash");
        userDao.saveUser(user);

    }

    @Test
    public  void findAll(){
        List<User> list=userDao.findAll();
        for (User user1 :list){
            System.out.print(user1.getEmail());
        }
    }

    @Test
    public  void find(){
        List<User> list =userDao.findUserByStr("nas");
        for (User user2 :list){
            System.out.print(user2.getName());
        }
    }
}
