export const generateMockQuestions = () => {
  return [
    {
      category: "计算机网络", 
      questions: [
        { 
          id: "net1", 
          text: "OSI七层模型和TCP/IP四层模型分别是什么？它们之间有什么对应关系？", 
          difficulty: "简单", 
          referenceAnswer: "OSI七层：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层。\nTCP/IP四层：网络接口层（链路层）、网际层（网络层）、传输层、应用层。\n对应关系：OSI的应用层、表示层、会话层对应TCP/IP的应用层。OSI的传输层对应TCP/IP的传输层。OSI的网络层对应TCP/IP的网际层。OSI的数据链路层和物理层对应TCP/IP的网络接口层。",
          resources: [{ text: "OSI模型详解", url: "#" }],
          followUps: [
            { 
              id: "net1_f1", 
              text: "TCP/IP模型中的应用层常见的协议有哪些？请至少列举三个。", 
              referenceAnswer: "常见的应用层协议有 HTTP/HTTPS (网页), FTP (文件传输), SMTP (邮件发送), POP3/IMAP (邮件接收), DNS (域名解析), Telnet (远程登录)等。" 
            }
          ]
        },
        { 
          id: "net2", 
          text: "HTTP常见的状态码有哪些？分别代表什么含义？（至少列举5类）", 
          difficulty: "中等", 
          referenceAnswer: "1xx (信息性状态码): 100 Continue\n2xx (成功状态码): 200 OK, 201 Created, 204 No Content\n3xx (重定向状态码): 301 Moved Permanently, 302 Found, 304 Not Modified\n4xx (客户端错误状态码): 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found\n5xx (服务器错误状态码): 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable",
          resources: [{ text: "HTTP状态码大全", url: "#" }]
        }
      ]
    },
    { 
      category: "数据结构与算法", 
      questions: [
        { 
          id: "ds1", 
          text: "快速排序的平均时间复杂度和最坏时间复杂度分别是多少？如何优化最坏情况？", 
          difficulty: "中等", 
          referenceAnswer: "平均时间复杂度：O(n log n)\n最坏时间复杂度：O(n^2) (当输入数组已经有序或接近有序，且pivot选择不当时)\n\n优化最坏情况：\n1. 三数取中法选择pivot：从数组首、中、尾三个元素中选取中位数作为pivot。\n2. 随机选择pivot：随机选取一个元素作为pivot。\n3. 尾递归优化：对于递归调用中规模较小的那部分使用迭代实现，减少栈空间消耗。", 
          resources: []
        }
      ]
    },
    { 
      category: "计算机科学基础", 
      questions: [
        { 
          id: "cs1", 
          text: "请解释一下 TCP 的三次握手和四次挥手过程，并说明 TIME_WAIT 状态的作用。", 
          difficulty: "中等", 
          referenceAnswer: "TCP三次握手用于建立连接，确保双方收发能力正常。四次挥手用于断开连接，确保数据传输完毕且连接正常关闭。TIME_WAIT状态是为了保证TCP协议的全双工连接能够可靠地关闭。",
          resources: [{ text: "TCP详解", url: "#" }],
          followUps: [
            { 
              id: "cs1_f1", 
              text: "如果在TCP三次握手的第二次，服务器回复的SYN-ACK包在网络中丢失了，客户端会发生什么？服务器呢？", 
              referenceAnswer: "客户端：由于长时间未收到SYN-ACK，客户端的SYN请求会超时。TCP通常有重传机制，客户端会重新发送SYN包。重传次数和间隔通常是指数增加，达到一定次数后放弃连接。\n服务器：服务器发送SYN-ACK后会进入SYN_RCVD状态，并等待客户端的ACK。如果SYN-ACK丢失，服务器同样会因未收到ACK而超时重传SYN-ACK包。若多次重传后仍未收到ACK，服务器最终会放弃此次连接请求，释放资源。" 
            }
          ]
        }
      ]
    }
  ]
} 