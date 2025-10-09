package com.example.gateway;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
class HealthController {
  @GetMapping("/ping")
  Map<String,Object> ping() {
    return Map.of("ok", true, "service", "gateway");
  }
}
