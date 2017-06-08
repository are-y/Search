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
    public  void test(){
        User user=new User(1L,"nash","123456","271638652@qq.com","QQ");
        userDao.saveUser(user);
        List<User> list=userDao.findAll();
        for (User user1 :list){
            System.out.print(user1.getEmail());
        }

    }
}
