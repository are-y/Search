package com.search.entity;

import org.springframework.data.annotation.Id;

import java.io.Serializable;

/**
 * Created by Administrator on 2017/6/7.
 */
public class User  implements Serializable{


    @Id
    private Long id;

    private String  name;

    private String  pwd;

    private String  email;

    private String  source;

    public User() {
    }

    public User(Long id, String name, String pwd, String email, String source) {
        this.id = id;
        this.name = name;
        this.pwd = pwd;
        this.email = email;
        this.source = source;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPwd() {
        return pwd;
    }

    public String getEmail() {
        return email;
    }

    public String getSource() {
        return source;
    }
}
