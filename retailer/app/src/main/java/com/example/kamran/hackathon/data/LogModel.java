package com.example.kamran.hackathon.data;

public class LogModel {
    private String sn;
    private String name;
    private String phone;

    public LogModel(String sn, String name, String phone) {
        this.sn = sn;
        this.name = name;
        this.phone = phone;
    }

    public String getSn() {
        return sn;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }
}
