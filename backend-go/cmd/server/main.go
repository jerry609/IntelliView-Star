package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jerry609/intelliview-star/backend-go/internal/config"
	"github.com/jerry609/intelliview-star/backend-go/internal/handler"
	"github.com/jerry609/intelliview-star/backend-go/internal/middleware"
	"github.com/jerry609/intelliview-star/backend-go/internal/repository"
	"github.com/jerry609/intelliview-star/backend-go/internal/service"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title IntelliView Star API
// @version 1.0
// @description AI驱动的智能面试题生成与练习平台API
// @termsOfService https://github.com/jerry609/intelliview-star

// @contact.name API Support
// @contact.url https://github.com/jerry609/intelliview-star/issues
// @contact.email support@intelliview-star.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化数据库
	db, err := repository.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 初始化Redis
	redis, err := repository.NewRedis(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	// 初始化Repository层
	questionRepo := repository.NewQuestionRepository(db)
	userRepo := repository.NewUserRepository(db)
	answerRepo := repository.NewAnswerRepository(db)

	// 初始化Service层
	questionService := service.NewQuestionService(questionRepo, cfg)
	userService := service.NewUserService(userRepo, redis, cfg)
	answerService := service.NewAnswerService(answerRepo, questionRepo, cfg)
	authService := service.NewAuthService(userRepo, redis, cfg)

	// 初始化Handler层
	questionHandler := handler.NewQuestionHandler(questionService)
	userHandler := handler.NewUserHandler(userService)
	answerHandler := handler.NewAnswerHandler(answerService)
	authHandler := handler.NewAuthHandler(authService)

	// 设置Gin模式
	if cfg.Server.Mode == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建Gin引擎
	r := gin.New()

	// 中间件
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	
	// CORS配置
	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.Server.AllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// 健康检查端点
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "ok",
			"timestamp": handler.GetCurrentTimestamp(),
		})
	})

	// API路由组
	v1 := r.Group("/api/v1")
	{
		// 认证路由 (不需要JWT认证)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
		}

		// 需要认证的路由
		authorized := v1.Group("/")
		authorized.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
		{
			// 用户信息
			authorized.GET("/auth/profile", authHandler.GetProfile)
			authorized.POST("/auth/logout", authHandler.Logout)

			// 题目管理
			questions := authorized.Group("/questions")
			{
				questions.POST("/generate", questionHandler.GenerateQuestions)
				questions.GET("", questionHandler.GetQuestions)
				questions.GET("/:id", questionHandler.GetQuestionDetail)
				questions.GET("/categories", questionHandler.GetCategories)
				questions.POST("/search", questionHandler.SearchQuestions)
				questions.POST("/export", questionHandler.ExportQuestions)
			}

			// 答题管理
			answers := authorized.Group("/answers")
			{
				answers.POST("", answerHandler.SubmitAnswer)
				answers.POST("/:id/ai-score", answerHandler.GetAIScore)
				answers.GET("/history", answerHandler.GetAnswerHistory)
				answers.GET("/statistics", answerHandler.GetAnswerStatistics)
			}

			// 收藏功能
			favorites := authorized.Group("/favorites")
			{
				favorites.GET("", userHandler.GetFavorites)
				favorites.POST("", userHandler.AddFavorite)
				favorites.DELETE("/:questionId", userHandler.RemoveFavorite)
				favorites.GET("/export", userHandler.ExportFavorites)
			}

			// 错题本
			mistakes := authorized.Group("/mistakes")
			{
				mistakes.GET("", userHandler.GetMistakes)
				mistakes.POST("", userHandler.AddMistake)
				mistakes.DELETE("/:questionId", userHandler.MarkMistakeMastered)
				mistakes.GET("/export", userHandler.ExportMistakes)
			}

			// 练习集
			practiceSets := authorized.Group("/practice-sets")
			{
				practiceSets.GET("", userHandler.GetPracticeSets)
				practiceSets.POST("", userHandler.CreatePracticeSet)
				practiceSets.PUT("/:id", userHandler.UpdatePracticeSet)
				practiceSets.DELETE("/:id", userHandler.DeletePracticeSet)
				practiceSets.GET("/:id/questions", userHandler.GetPracticeSetQuestions)
				practiceSets.POST("/:id/questions", userHandler.AddQuestionToSet)
				practiceSets.GET("/:id/export", userHandler.ExportPracticeSet)
			}

			// 模拟面试
			mockInterview := authorized.Group("/mock-interview")
			{
				mockInterview.POST("", questionHandler.StartMockInterview)
				mockInterview.POST("/:sessionId/answers", answerHandler.SubmitMockAnswer)
				mockInterview.POST("/:sessionId/end", questionHandler.EndMockInterview)
				mockInterview.GET("/:sessionId/report", questionHandler.GetMockInterviewReport)
			}

			// 文件上传
			upload := authorized.Group("/upload")
			{
				upload.POST("/resume", questionHandler.UploadResume)
				upload.POST("/export", userHandler.ExportFile)
			}

			// 统计数据
			statistics := authorized.Group("/statistics")
			{
				statistics.GET("/overview", answerHandler.GetStatisticsOverview)
				statistics.GET("/category", answerHandler.GetCategoryStatistics)
				statistics.GET("/progress", answerHandler.GetProgressStatistics)
				statistics.GET("/activity", answerHandler.GetActivityStatistics)
			}
		}
	}

	// Swagger文档 (仅在开发环境)
	if cfg.Server.Mode != "production" {
		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	// 启动服务器
	log.Printf("Starting server on %s", cfg.Server.Port)
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
} 