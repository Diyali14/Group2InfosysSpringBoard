package com.carbontrack.app.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorResponse {

    private String timestamp;
    private int status;
    private String error;
    private String message;
}
