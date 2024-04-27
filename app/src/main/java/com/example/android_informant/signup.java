package com.example.android_informant;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class signup extends AppCompatActivity {
    Button signUp;
    EditText userName;
    EditText password;
    EditText email;
    EditText cridetCard;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        signUp = findViewById(R.id.signUp);
        userName = findViewById(R.id.username);
        password = findViewById(R.id.password);
        email = findViewById(R.id.email);
        cridetCard = findViewById(R.id.cridetCard);
        signUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent opener = new Intent(signup.this,login.class);
                startActivity(opener);
                password.requestFocus();
                Log.d("tag1","works");
            }
        });
    }
}