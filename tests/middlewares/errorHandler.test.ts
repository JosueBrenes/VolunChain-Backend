import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../src/middlewares/errorHandler";
import {
  ValidationError,
  AuthenticationError,
  ResourceNotFoundError,
  InternalServerError,
  CustomError,
} from "../../src/errors";

describe("Error Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      path: "/test",
      method: "GET",
      body: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should handle ValidationError correctly", () => {
    const error = new ValidationError("Invalid input", { field: "username" });

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Invalid input",
      errorCode: "VALIDATION_ERROR",
      details: { field: "username" },
    });
  });

  it("should handle AuthenticationError correctly", () => {
    const error = new AuthenticationError("Invalid credentials");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 401,
      message: "Invalid credentials",
      errorCode: "AUTHENTICATION_ERROR",
    });
  });

  it("should handle ResourceNotFoundError correctly", () => {
    const error = new ResourceNotFoundError("User not found");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 404,
      message: "User not found",
      errorCode: "RESOURCE_NOT_FOUND",
    });
  });

  it("should handle unknown errors by converting them to InternalServerError", () => {
    const error = new Error("Something went wrong");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: "Something went wrong",
      errorCode: "INTERNAL_ERROR",
    });
  });

  it("should include stack trace and request details in development environment", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const error = new Error("Test error");
    error.stack = "Test stack trace";

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("stack"));
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("requestBody")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("requestQuery")
    );

    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });
});
