面这份就是“安装/启动 Supabase 并启用管理员账号”的操作文档（按你这个仓库的方式：Supabase 随 docker     
  compose 一起跑，不需要单独另装 Supabase）。                                                             
                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 目标                                                                                                 
                                                                                                          
  - 在本机启动 Supabase（含 Studio）                                                                      
  - 创建一个 Supabase Auth 用户                                                                           
  - 把该用户升级为 admin，从而能访问平台前端 /admin/* 和后端 */admin/* 接口                               
                                                                                                          
  > 仓库里已有更完整版本：autogpt_platform/admin_access_setup_zh.md、autogpt_platform/admin_setup_guide.md                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 1) 前置条件（一次性）                                                                                
                                                                                                          
  1. 安装 Docker Desktop（包含 Docker Compose v2）                                                        
  2. 确保端口不冲突（默认会用到）：                                                                       
      - 平台前端：3000                                                                                    
      - 平台后端 REST：8006                                                                               
      - Supabase Studio：8082                                                                             
      - Supabase API(Kong)：通常 8000                                                                     
      - Postgres：5432                                                                                    
                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 2) 启动 Supabase（推荐：带 Studio）                                                                  
                                                                                                          
  在 PowerShell 里执行：                                                                                  
                                                                                                          
  cd D:\mycode\2026\AutoGPT\autogpt_platform                                                              
  docker compose -f docker-compose.yml -f db/docker/docker-compose.yml -f db/docker/dev/docker-           
  compose.dev.yml --profile local up -d kong auth db studio meta                                          
                                                                                                          
  检查是否起来了：                                                                                        
                                                                                                          
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"                                          
                                                                                                          
  打开 Supabase Studio：                                                                                  
                                                                                                          
  - http://localhost:8082                                                                                 
                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 3) 确认/准备环境变量（平台要用）                                                                     
                                                                                                          
  平台通常需要这些（在 autogpt_platform/.env）：                                                          
                                                                                                          
  - SUPABASE_URL（示例：http://localhost:8000）                                                           
  - SUPABASE_ANON_KEY                                                                                     
  - SUPABASE_SERVICE_ROLE_KEY                                                                             
  - SUPABASE_JWT_SECRET 或后端用的 JWT_VERIFY_KEY（必须与 Supabase 的 JWT_SECRET 一致）                   
                                                                                                          
  如果你是按仓库默认启动，一般 autogpt_platform/.env 已经给了本地默认值；只要不手动改乱，通常不需要额外操 
  作。                                                                                                    
                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 4) 创建一个 Supabase Auth 用户                                                                       
                                                                                                          
  方式 A（推荐，走 Studio）：                                                                             
                                                                                                          
  1. 打开 http://localhost:8082                                                                           
  2. 左侧 Auth → Users                                                                                    
  3. Add user                                                                                             
  4. 填邮箱+密码                                                                                          
  5. 勾选 Confirm user（避免邮件确认流程卡住）                                                            
                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 5) 把用户升级为管理员（关键一步）                                                                    
                                                                                                          
  本项目的管理员判断绑定在 Supabase JWT 的 role 上：需要让该用户拿到的 JWT payload 里包含 role: "admin"。 
                                                                                                          
  在 Studio 左侧打开 SQL Editor，执行（把邮箱改成你的）：                                                 
                                                                                                          
  update auth.users                                                                                       
  set                                                                                                     
    role = 'admin',                                                                                       
    raw_app_meta_data = jsonb_set(                                                                        
      coalesce(raw_app_meta_data, '{}'::jsonb),                                                           
      '{role}',                                                                                           
      '"admin"',                                                                                          
      true                                                                                                
    )                                                                                                     
  where email = 'admin@example.com';                                                                      
                                                                                                          
  不想用 Studio 的话也可以直接在容器里跑（把邮箱改成你的）：                                              
                                                                                                          
  docker exec supabase-db psql -U postgres -d postgres -c "update auth.users set role = 'admin',          
  raw_app_meta_data = jsonb_set(coalesce(raw_app_meta_data, '{}'::jsonb), '{role}', '\"admin\"', true)    
  where email = 'admin@example.com';"                                                                     
                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 6) 重新登录（非常重要）                                                                              
                                                                                                          
  执行完升级后，必须“退出并重新登录”一次（否则你还在用旧 token，role 不会变）。                           
                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 7) 验证是否生效                                                                                      
                                                                                                          
  - 前端：登录后访问 http://localhost:3000/admin（或 http://localhost:3000/admin/marketplace）            
  - 后端（示例，用 Supabase 密码登录换 token，再带 Bearer 调 admin API）：                                
                                                                                                          
  $body = @{ email = "admin@example.com"; password = "你的密码" } | ConvertTo-Json                        
  $resp = Invoke-RestMethod -Method Post `                                                                
    -Headers @{ apikey = $env:SUPABASE_ANON_KEY; "Content-Type" = "application/json" } `                  
    -Body $body `                                                                                         
    -Uri "$env:SUPABASE_URL/auth/v1/token?grant_type=password"                                            
  $token = $resp.access_token                                                                             
                                                                                                          
  Invoke-RestMethod -Headers @{ Authorization = "Bearer $token" } -Uri "http://localhost:8006/api/store/  
  admin/listings"                                                                                         
                                                                                                          
  ———                                                                                                     
                                                                                                          
  ## 常见问题                                                                                             
                                                                                                          
  - /admin 仍然 403/重定向：确认你“重新登录”了，并且你执行 SQL 时邮箱没写错。                             
  - 后端提示 Invalid token：检查 JWT_VERIFY_KEY/SUPABASE_JWT_SECRET 是否与 Supabase 的 JWT_SECRET 一致（本    地默认通常来自 autogpt_platform/.env）。                                                              
  - 8082 打不开：看 docker ps 里 supabase-studio 是否有端口映射（0.0.0.0:8082->8082/tcp）。               
                                                                                                          
  如果你把你现在的 autogpt_platform/.env 里 SUPABASE_URL 和端口（例如 8000/8082）贴一下（遮住 key 的中间部
  分即可），我可以按你当前配置把上面的命令都替你对齐成“可直接复制运行”的版本。 