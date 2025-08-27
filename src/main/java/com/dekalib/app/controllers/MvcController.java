package com.dekalib.app.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MvcController {
    @GetMapping("/calculator")
    public String sayHello(Model model,
                           @RequestParam("a") int a,
                           @RequestParam("b") int b,
                           @RequestParam("action") String action) {
        model.addAttribute("a", a);
        model.addAttribute("b", b);
        int result = 0;
        switch (action) {
            case "+":
                result = a + b;
                break;
            case "-":
                result = a - b;
                break;
            case "*":
                result = a * b;
                break;
            case "/":
                result = a / b;
                break;
        }
        model.addAttribute("result" , result);
        return "calculator";
    }

    @GetMapping("/preview")
    public String preview() {
        return "preview";
    }
}
