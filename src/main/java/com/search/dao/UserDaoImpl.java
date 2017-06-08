package com.search.dao;


import com.search.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by Administrator on 2017/6/7.
 */
@Component
public class UserDaoImpl implements UserDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void saveUser(User user) {
        mongoTemplate.save(user);
    }

    @Override
    public List<User> findUserByStr(String str) {
        Query query=new Query(
                new Criteria().orOperator(Criteria.where("name").regex(".*?"+str+".*"),Criteria.where("email").regex(".*?"+str+".*"))
        );
        List<User> result=mongoTemplate.find(query,User.class);
        return result;
    }

    @Override
    public List<User> findAll() {
        return mongoTemplate.findAll(User.class);

    }
}

