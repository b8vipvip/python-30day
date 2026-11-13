"use strict";

const zones = [
  { id: "forest", name: "Python 森林", subtitle: "从语法小径出发，认识 Python 的魔法", emoji: "🌲", symbol: "🌿", range: [1, 7], theme: "zone-forest" },
  { id: "castle", name: "API 城堡", subtitle: "搭建后端、连接数据库，让程序真正工作", emoji: "🏰", symbol: "✨", range: [8, 14], theme: "zone-castle" },
  { id: "debug", name: "Debug 深渊", subtitle: "驯服 Bug、测试边界，成为可靠性守护者", emoji: "🧪", symbol: "⚡", range: [15, 21], theme: "zone-debug" },
  { id: "ship", name: "交付者群岛", subtitle: "容器化、代码评估，完成你的工程作品", emoji: "🚀", symbol: "🪐", range: [22, 30], theme: "zone-ship" }
];

const resourceMap = {
  forest: [
    { label: "Python 官方教程", url: "https://docs.python.org/3/tutorial/" },
    { label: "内置数据类型", url: "https://docs.python.org/3/library/stdtypes.html" },
    { label: "异常与错误", url: "https://docs.python.org/3/tutorial/errors.html" }
  ],
  castle: [
    { label: "FastAPI 官方教程", url: "https://fastapi.tiangolo.com/tutorial/" },
    { label: "SQLAlchemy 2.x", url: "https://docs.sqlalchemy.org/en/20/" },
    { label: "asyncio 官方文档", url: "https://docs.python.org/3/library/asyncio.html" }
  ],
  debug: [
    { label: "Pytest 文档", url: "https://docs.pytest.org/en/stable/" },
    { label: "Python Debug 与性能分析", url: "https://docs.python.org/3/library/debug.html" },
    { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }
  ],
  ship: [
    { label: "Docker 官方文档", url: "https://docs.docker.com/" },
    { label: "GitHub Actions 文档", url: "https://docs.github.com/en/actions" },
    { label: "Ruff 代码质量工具", url: "https://docs.astral.sh/ruff/" },
    { label: "Mypy 类型检查", url: "https://mypy.readthedocs.io/en/stable/" }
  ]
};

const rawDays = [
  [1,"forest","唤醒 Python 精灵","写下第一行代码，点亮冒险地图。","🐍",35,"新手","认识 Python 的运行方式，掌握变量、基础类型和 print，让程序第一次回应你。",["配置 Python 3 环境并运行脚本","理解变量、字符串、整数和布尔值","使用 print() 输出格式化结果"],["变量与赋值","int / float / str / bool","print() 与 f-string"],"制作一张冒险者名片","创建一个 profile.py，输出你的昵称、职业、等级和一句冒险宣言。",["创建 profile.py 文件","用变量保存昵称、职业和等级","使用 f-string 输出整齐的名片"],"终端中能看到一张包含 4 项信息的名片。","name = 'Code Ranger'\\nlevel = 1\\nrole = 'Python Explorer'\\nprint(f'{name} · Lv.{level}')\\nprint(f'职业：{role}')","下面哪一种写法可以把变量 name 的值嵌入字符串？",["'Hello, {name}'","f'Hello, {name}'","'Hello' + {name}","print(name = 'Hello')"],1,"f-string 在字符串前加 f，并用花括号包裹变量或表达式。",false],
  [2,"forest","数据背包整理术","列表、字典和集合，装下你的冒险物资。","🎒",40,"入门","Python 容器能帮你组织成组的数据。今天学习何时使用 list、tuple、dict 和 set。",["创建和修改 list","用 dict 表示结构化对象","理解 set 去重和 tuple 不可变"],["list 列表","dict 字典","set 集合与 tuple 元组"],"整理一份装备清单","把装备保存为列表，把角色属性保存为字典，并去掉重复的掉落物。",["创建至少 4 项装备的列表","用字典记录角色名、生命值和职业","使用 set 去除重复道具"],"输出去重后的装备清单和角色信息。","items = ['键盘', '药水', '地图', '药水']\\nunique_items = list(set(items))\\nhero = {'name': 'Py', 'hp': 100}\\nprint(unique_items)\\nprint(hero['hp'])","如果要通过键 'hp' 快速读取角色生命值，最合适的数据结构是？",["list","tuple","dict","set"],2,"dict 是键值映射，适合通过明确的键读取结构化属性。",false],
  [3,"forest","函数魔法工坊","把重复动作封装起来，让代码更好复用。","🪄",45,"入门","函数让程序拥有可复用的动作。掌握参数、返回值、作用域和默认参数的安全写法。",["定义函数并调用","区分 print 和 return","理解位置参数、关键字参数和默认参数"],["def 与 return","参数和作用域","可变默认参数陷阱"],"打造伤害计算器","编写 calculate_damage，支持基础伤害和暴击倍率，并返回最终伤害。",["设计函数签名和参数默认值","分别测试普通攻击与暴击","为非法输入添加清晰的异常"],"函数返回正确数值，而不是只把结果打印出来。","def calculate_damage(base, multiplier=1.0):\\n    if base < 0:\\n        raise ValueError('base must be non-negative')\\n    return base * multiplier\\n\\nprint(calculate_damage(20, 1.5))","函数中哪一个关键字用于把计算结果交还给调用者？",["yield","return","print","pass"],1,"return 将值返回给调用者；print 只负责向输出流显示内容。",false],
  [4,"forest","异常沼泽求生","让程序优雅地处理错误，而不是当场倒下。","🛡️",40,"入门","异常是程序运行时的错误信号。学会捕获预期异常、清理资源和避免裸 except。",["使用 try / except / else / finally","捕获具体异常类型","主动 raise 有意义的异常"],["ValueError 与 TypeError","异常传播","finally 与资源清理"],"修复药水计算器","编写一个安全的数值转换器，面对空字符串和非法输入时给出友好提示。",["使用 int() 转换输入","只捕获 ValueError","为错误输入返回可理解的信息"],"非法输入不会让程序崩溃，也不会静默吞掉错误。","def parse_quantity(raw):\\n    try:\\n        value = int(raw)\\n    except ValueError as exc:\\n        raise ValueError('数量必须是整数') from exc\\n    if value < 0:\\n        raise ValueError('数量不能为负数')\\n    return value","为什么不建议用一个裸 except 捕获所有异常？",["它会让程序变慢","会隐藏未预期的问题，难以定位故障","Python 不允许","只能捕获语法错误"],1,"过宽的异常捕获会掩盖程序缺陷，也可能把系统错误当成正常业务分支。",false],
  [5,"forest","迭代器与生成器秘境","学会按需取值，不必一次把所有数据装进内存。","🌀",45,"进阶","迭代器协议和生成器是 Python 高效处理序列与流式数据的重要基础。",["理解 iterable 与 iterator","使用 yield 创建生成器","说明惰性求值的价值"],["iter() 与 next()","yield","惰性求值"],"制作宝箱掉落流","实现一个逐个产出掉落物的生成器，并只取前两个结果。",["编写包含 yield 的函数","使用 next() 或 for 消费","解释为什么它不会一次构造全部结果"],"生成器能按需产出物品，支持逐项处理。","def loot_stream():\\n    for item in ['金币', '宝石', '古地图']:\\n        yield item\\n\\nloot = loot_stream()\\nprint(next(loot))\\nprint(next(loot))","生成器函数中，哪个关键字会暂停函数并产出一个值？",["return","yield","await","break"],1,"yield 产出值并暂停执行，下一次迭代时从暂停处继续。",false],
  [6,"forest","装饰器与上下文结界","给函数加能力，给资源加上可靠的生命周期。","🎀",50,"进阶","装饰器包装函数行为；上下文管理器确保资源在正确时机释放。",["读懂闭包和装饰器基本结构","使用 functools.wraps","理解 with 与 __enter__/__exit__"],["闭包","@decorator","with 与 context manager"],"给技能加冷却日志","编写一个计时或日志装饰器，包装一个技能函数，并保留原函数元信息。",["实现 wrapper 并调用原函数","使用 functools.wraps","用 with 打开文件并确保自动关闭"],"装饰器可复用，原函数的 __name__ 等元信息被保留。","from functools import wraps\\n\\ndef announce(fn):\\n    @wraps(fn)\\n    def wrapper(*args, **kwargs):\\n        print('技能发动！')\\n        return fn(*args, **kwargs)\\n    return wrapper\\n\\n@announce\\ndef heal(points):\\n    return points","functools.wraps 最主要的作用是什么？",["让函数异步运行","保留被装饰函数的元信息","自动捕获异常","缓存所有结果"],1,"wraps 将原函数的名称、文档字符串等元信息复制到 wrapper。",false],
  [7,"forest","森林守关 Boss","把前六天的技能组合起来，完成第一个小项目。","🐉",70,"Boss 战","综合使用数据结构、函数、异常和文件操作，构建一个可运行的小型命令行冒险记录器。",["拆分模块与函数职责","读写 JSON 数据","覆盖正常和异常输入"],["json 模块","模块化设计","输入校验"],"击败森林守关龙","实现一个命令行冒险者档案：创建角色、增加经验、保存并重新读取 JSON。",["设计角色数据结构和函数","使用 json.dump / json.load 持久化","处理文件不存在和非法数据"],"重新运行程序后，角色经验仍然存在；核心逻辑至少有 3 个测试用例。","import json\\nfrom pathlib import Path\\n\\ndef save_profile(profile, path='hero.json'):\\n    Path(path).write_text(json.dumps(profile), encoding='utf-8')\\n\\ndef load_profile(path='hero.json'):\\n    return json.loads(Path(path).read_text(encoding='utf-8'))","保存 JSON 文件时，哪个函数适合把 Python 对象序列化到文件对象？",["json.load","json.dump","json.parse","json.read"],1,"json.dump(obj, file) 将 Python 对象序列化并写入文件；json.load(file) 则从文件读取。",true],
  [8,"castle","进入 API 城堡","让 Python 服务对外开放，理解 HTTP 和路由。","🏰",45,"入门","从 HTTP 基础开始，用 FastAPI 创建第一个 Web API，并理解请求与响应。",["理解 GET / POST 等 HTTP 方法","创建 FastAPI 应用和路由","查看自动生成的 OpenAPI 文档"],["HTTP 请求与响应","路由与状态码","FastAPI app"],"搭建冒险者信息站","创建一个 FastAPI 服务，提供健康检查和角色信息两个 GET 接口。",["创建 app 实例","实现 /health 和 /hero 路由","运行服务并打开 /docs 验证"],"浏览器能访问接口，/docs 能看到自动生成的接口文档。","from fastapi import FastAPI\\n\\napp = FastAPI(title='Quest API')\\n\\n@app.get('/health')\\ndef health():\\n    return {'status': 'ok'}","FastAPI 默认会在哪个路径提供 Swagger UI 文档？",["/admin","/docs","/swagger.json","/health"],1,"FastAPI 默认在 /docs 提供 Swagger UI，在 /redoc 提供 ReDoc。",false],
  [9,"castle","Pydantic 数据炼金术","在数据进入系统前先验证，让接口更可信。","🧪",45,"进阶","Pydantic 模型负责解析和校验数据。掌握字段约束、可选字段和响应模型。",["定义 BaseModel","使用 Field 设置约束","区分请求模型与响应模型"],["BaseModel","Field 与 validator","response_model"],"给角色报名表加校验","定义 CreateHero 模型，校验名称长度、等级范围和可选简介。",["定义字段类型和默认值","用 Field 设置 ge / max_length","在 FastAPI 路由中使用模型"],"非法数据返回 422，合法数据被解析成类型明确的模型。","from pydantic import BaseModel, Field\\n\\nclass CreateHero(BaseModel):\\n    name: str = Field(min_length=2, max_length=30)\\n    level: int = Field(default=1, ge=1, le=99)\\n    bio: str | None = None","Pydantic 的 BaseModel 最主要用于什么？",["创建数据库连接","解析和校验结构化数据","启动 Web 服务器","执行 SQL"],1,"BaseModel 定义数据结构并负责解析、类型转换与校验。",false],
  [10,"castle","数据库地牢探险","用 SQLAlchemy 把业务对象安全地保存到数据库。","🗄️",55,"进阶","学习 SQLAlchemy 2.x 声明式模型、Session 生命周期和基础 CRUD。",["定义 ORM 模型","创建 Engine 和 Session","实现新增、查询、更新和删除"],["DeclarativeBase","Engine / Session","select 与 commit"],"建立任务公告板","创建 Task 模型，并实现任务创建、列表查询和状态更新。",["配置数据库 URL","定义主键、字段和约束","使用 Session 执行 CRUD"],"重启服务后数据仍存在，Session 在请求结束后正确关闭。","from sqlalchemy import create_engine, select\\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session\\n\\nclass Base(DeclarativeBase): pass\\nclass Task(Base):\\n    __tablename__ = 'tasks'\\n    id: Mapped[int] = mapped_column(primary_key=True)\\n    title: Mapped[str]\\n\\nengine = create_engine('sqlite:///app.db')","SQLAlchemy 2.x 中，通常用哪个对象表示一次数据库会话？",["Engine","Session","Mapper","BaseModel"],1,"Session 管理 ORM 对象状态和事务，是应用与数据库交互的工作单元。",false],
  [11,"castle","事务与幂等护盾","防止重复提交和半成功写入，守住数据一致性。","🛡️",55,"进阶","理解事务边界、commit / rollback、唯一约束和幂等请求设计。",["解释 ACID 的核心含义","在失败时 rollback","使用唯一键防止重复写入"],["事务与 ACID","唯一约束","幂等键"],"修复重复领取奖励 Bug","设计奖励领取接口：同一个 request_id 重试多次，也只能入账一次。",["为 request_id 建立唯一约束","在同一事务中写入领取记录和余额","模拟中途异常并验证回滚"],"重复请求不会重复发奖；异常后数据没有部分提交。","with Session(engine) as session:\\n    try:\\n        session.add(reward_claim)\\n        session.commit()\\n    except Exception:\\n        session.rollback()\\n        raise","保证同一个业务请求重复执行不会重复产生副作用，这种设计称为什么？",["序列化","幂等性","懒加载","负载均衡"],1,"幂等性保证同一请求重复提交时，业务结果不会被重复放大。",false],
  [12,"castle","HTTPX 外部世界连接器","可靠调用第三方 API，处理超时、错误和重试。","🌐",45,"进阶","使用 HTTPX 调用外部服务，设置超时，区分网络错误与 HTTP 错误。",["使用 AsyncClient","设置连接和读取超时","正确处理状态码和异常"],["HTTPX Client","Timeout","raise_for_status"],"连接天气情报站","实现一个异步客户端调用公开或本地 mock API，并把失败转换为清晰错误。",["使用 async with 管理 AsyncClient","配置 timeout","对非 2xx 响应调用 raise_for_status"],"请求成功可解析 JSON；超时和 HTTP 错误不会被静默忽略。","import httpx\\n\\nasync def fetch_data(url):\\n    timeout = httpx.Timeout(5.0)\\n    async with httpx.AsyncClient(timeout=timeout) as client:\\n        response = await client.get(url)\\n        response.raise_for_status()\\n        return response.json()","HTTPX 中哪个参数用于限制请求等待时间？",["retry","timeout","headers","follow_redirects"],1,"timeout 用于控制连接、读取、写入和连接池等待的超时行为。",false],
  [13,"castle","asyncio 并发魔法","让等待网络的任务并行推进，而不是排队发呆。","⚡",55,"进阶","掌握协程、事件循环、gather、create_task、Semaphore 和取消机制。",["理解 async / await","使用 gather 并发等待","用 Semaphore 限制并发量"],["Coroutine","asyncio.gather","Semaphore 与 timeout"],"同时侦察三座岛屿","模拟三个异步网络任务，比较串行与并发耗时，并限制最大并发数。",["编写带 asyncio.sleep 的协程","使用 gather 并发运行","用 Semaphore 限制同时运行数量"],"并发版本总耗时接近最慢任务耗时，而非所有等待时间之和。","import asyncio\\n\\nasync def scout(name):\\n    await asyncio.sleep(1)\\n    return name + '：侦察完成'\\n\\nasync def main():\\n    results = await asyncio.gather(scout('北岛'), scout('南岛'))\\n    print(results)\\n\\nasyncio.run(main())","asyncio.gather() 的主要作用是什么？",["创建数据库表","并发调度多个 awaitable 并收集结果","启动多进程","把函数变成生成器"],1,"gather 并发运行多个 awaitable，并按传入顺序收集结果。",false],
  [14,"castle","API 城堡守关 Boss","交付一个带数据库、校验和异步外部调用的服务。","🦄",75,"Boss 战","把 FastAPI、Pydantic、SQLAlchemy、HTTPX 和异步能力组合成一个完整后端。",["完成 REST CRUD API","建立数据库持久化","增加校验、错误处理和 API 测试"],["分层结构","依赖注入","异步 I/O"],"击败城堡守关者","交付一个任务管理 API：任务 CRUD、分页、状态过滤、健康检查和外部 API mock。",["拆分 api / schemas / services / repositories","实现数据库依赖和事务边界","为主要端点编写集成测试"],"项目可启动、接口可调用、数据库持久化正常，核心 API 测试通过。","@app.post('/tasks', response_model=TaskRead)\\ndef create_task(payload: TaskCreate, session: SessionDep):\\n    task = Task(**payload.model_dump())\\n    session.add(task)\\n    session.commit()\\n    session.refresh(task)\\n    return task","在 FastAPI 中，依赖注入最常见的用途之一是什么？",["自动生成 CSS","复用并管理数据库 Session 等依赖","替代 HTTP 协议","绕过数据校验"],1,"依赖注入可集中管理 Session、认证、配置等资源，并便于测试时替换依赖。",true],
  [15,"debug","Pytest 测试训练场","从“我觉得能跑”升级为“我证明它正确”。","🧫",45,"入门","学习测试发现、断言、fixture、参数化，让每次改动都有安全网。",["编写测试函数和断言","使用 fixture 管理测试准备","用 parametrize 覆盖多组输入"],["pytest 命名约定","fixture scope","parametrize"],"给伤害计算器做体检","为伤害函数补齐正常值、边界值和非法输入测试。",["编写 test_ 开头的函数","用 pytest.raises 验证异常","参数化覆盖至少 4 组输入"],"pytest 能自动发现测试，正常和异常路径都有断言。","import pytest\\n\\n@pytest.mark.parametrize('base, expected', [(10, 10), (20, 30)])\\ndef test_damage(base, expected):\\n    assert calculate_damage(base, 1.5) == expected\\n\\ndef test_negative_damage():\\n    with pytest.raises(ValueError):\\n        calculate_damage(-1)","pytest 中哪个工具适合验证代码会抛出指定异常？",["pytest.raises","pytest.fixture","pytest.mark.skip","pytest.param"],0,"pytest.raises 用于断言某段代码会抛出指定异常类型。",false],
  [16,"debug","Mock 幻影实验室","隔离外部依赖，让测试只关注你真正想验证的逻辑。","🧙",50,"进阶","Mock 和 monkeypatch 能替换网络、时间、环境变量等外部依赖。",["理解 mock 与 stub 的差异","使用 monkeypatch 替换依赖","验证调用次数和参数"],["unittest.mock","monkeypatch","依赖注入测试"],"制造一场断网演习","模拟外部 API 超时和成功响应，验证服务层的降级逻辑。",["把外部请求封装在可替换函数中","用 monkeypatch 替换请求函数","断言错误分支和成功分支"],"测试不依赖真实网络，结果稳定且可重复。","from unittest.mock import Mock\\n\\nclient = Mock()\\nclient.get.return_value = {'status': 'ok'}\\nresult = client.get('/health')\\nassert result['status'] == 'ok'\\nclient.get.assert_called_once_with('/health')","Mock 对象的 assert_called_once_with() 用来验证什么？",["函数运行耗时","调用次数和调用参数","数据库事务是否提交","代码覆盖率"],1,"它验证 mock 是否恰好被调用一次，并且参数与期望完全匹配。",false],
  [17,"debug","集成测试迷宫","验证多个模块连在一起时，系统仍然按预期工作。","🧩",55,"进阶","单元测试验证局部逻辑，集成测试验证组件协作；学习测试数据库与 API 客户端。",["使用 TestClient 测试 FastAPI","为测试创建独立数据库","覆盖认证、校验和错误响应"],["TestClient","测试数据库隔离","依赖覆盖"],"走通完整任务流程","从创建任务到查询、更新、删除，写一条完整 API 集成测试。",["替换生产数据库依赖","调用真实路由而非直接调用函数","断言状态码、响应体和持久化结果"],"测试可以独立运行，且不会污染开发或生产数据。","def test_create_task(client):\\n    response = client.post('/tasks', json={'title': 'Learn pytest'})\\n    assert response.status_code == 201\\n    assert response.json()['title'] == 'Learn pytest'","集成测试最主要验证什么？",["单个函数内部每一行","多个组件协作后的行为","只验证代码格式","只检查依赖版本"],1,"集成测试关注模块、服务或基础设施组合后是否正确协作。",false],
  [18,"debug","并发 Bug 猎场","找出竞态条件、共享状态和异步测试中的隐蔽问题。","🐞",55,"进阶","并发错误往往难以稳定复现。学习锁、原子操作、隔离共享状态和异步测试。",["解释 race condition","使用 Lock 保护共享状态","测试异步函数和任务取消"],["threading.Lock","asyncio.Lock","pytest-asyncio"],"抓住重复扣血 Bug","构造并发扣减库存场景，解释为什么普通读改写可能产生竞态，并修复它。",["编写并发复现脚本","使用锁或数据库原子更新","重复运行压力测试验证"],"并发执行时库存不会变成负数，也不会丢失更新。","import asyncio\\n\\nlock = asyncio.Lock()\\nstock = 1\\n\\nasync def buy():\\n    global stock\\n    async with lock:\\n        if stock > 0:\\n            stock -= 1\\n            return True\\n    return False","多个任务同时读写共享状态导致结果依赖执行时序，这类问题称为？",["死锁必然","竞态条件","内存泄漏","类型错误"],1,"竞态条件是并发操作的执行时序影响最终结果，常见于未保护的共享状态。",false],
  [19,"debug","Traceback 侦探社","从错误现场追踪根因，而不是只修复表面症状。","🔎",50,"进阶","掌握 traceback、logging、pdb、cProfile 和 tracemalloc，形成系统化 Debug 流程。",["读懂异常堆栈","用日志记录上下文","定位 CPU 和内存热点"],["traceback 与 logging","pdb","cProfile / tracemalloc"],"破解性能谜案","给一个慢函数加性能测量，找出耗时热点并记录关键日志。",["先构造可复现输入","用 cProfile 分析函数调用","记录有用上下文而非打印敏感数据"],"报告根因、复现步骤和修复前后指标。","import cProfile\\n\\ndef main():\\n    sum(i * i for i in range(100_000))\\n\\ncProfile.run('main()')","定位 Python CPU 热点最直接的标准库工具之一是？",["cProfile","json","pathlib","secrets"],0,"cProfile 记录函数调用次数和耗时，帮助定位 CPU 时间主要花在哪里。",false],
  [20,"debug","安全漏洞禁区","学会识别常见输入攻击、秘密泄露和不安全执行。","🔐",60,"进阶","安全问题常来自信任用户输入、拼接 SQL、暴露密钥和不受控的文件路径。",["识别 SQL 注入和路径遍历","使用参数化查询","理解密钥和最小权限原则"],["SQL Injection","Path Traversal","Secret Management / SSRF"],"修补藏宝库漏洞","审查一个文件下载或数据库查询接口，列出风险并实现安全修复。",["避免字符串拼接 SQL","规范化并限制文件路径范围","从环境变量读取密钥且不写入日志"],"提交至少 3 个风险点、修复代码和回归测试。","from pathlib import Path\\n\\nROOT = Path('/srv/uploads').resolve()\\ndef safe_path(name):\\n    target = (ROOT / name).resolve()\\n    if ROOT not in target.parents and target != ROOT:\\n        raise ValueError('invalid path')\\n    return target","防止 SQL 注入最推荐的基础做法是什么？",["手动删除单引号","使用参数化查询","把 SQL 放到前端","对输入做 Base64"],1,"参数化查询把 SQL 结构和用户数据分离，避免用户输入被解释为 SQL 语法。",false],
  [21,"debug","Debug 深渊守关 Boss","把测试、排错、并发和安全知识整合成一次故障演练。","👾",75,"Boss 战","像真实工程师一样接手一份有缺陷的代码，复现问题、定位根因、修复并回归。",["区分症状、根因和影响范围","先写失败测试再修复","提供可验证的安全与性能证据"],["故障复现","根因分析","回归测试与修复报告"],"击败深渊 Bug 王","修复一个模拟订单服务中的重复下单、异常吞噬和路径校验缺陷。",["为每个缺陷编写失败测试","按影响和风险排序修复","运行全量测试并写简短 RCA"],"所有回归测试通过，报告包含根因、修复和预防措施。","def create_order(user_id, idempotency_key, payload):\\n    if not idempotency_key:\\n        raise ValueError('idempotency key required')\\n    # Persist the key with a unique constraint in the same transaction.\\n    return order_service.create_once(user_id, idempotency_key, payload)","一次完整的故障复盘报告最应该解释什么？",["只写谁提交了代码","影响、时间线、根因、修复与预防措施","只贴错误截图","只列出所有日志"],1,"有效 RCA 聚焦系统影响、根因、修复验证和长期预防，而非责怪个人。",true],
  [22,"ship","Docker 飞船制造厂","把应用装进可重复运行的容器，告别“我电脑能跑”。","🐳",50,"进阶","理解镜像、容器、Dockerfile、端口映射、环境变量和多阶段构建。",["编写 Dockerfile","区分 image 和 container","使用环境变量配置服务"],["Dockerfile","Image / Container","Compose"],"给 API 装上飞船外壳","为 FastAPI 项目构建镜像，并用 Docker Compose 启动 API 与数据库。",["选择合适的 Python 基础镜像","复制依赖清单并安装依赖","配置端口、环境变量和健康检查"],"新环境只需 docker compose up 即可启动服务。","FROM python:3.12-slim\\nWORKDIR /app\\nCOPY requirements.txt .\\nRUN pip install --no-cache-dir -r requirements.txt\\nCOPY . .\\nCMD uvicorn app.main:app --host 0.0.0.0 --port 8000","Docker 镜像和容器的关系更接近哪一种？",["镜像是运行实例，容器是模板","镜像是模板，容器是运行实例","两者完全相同","容器只能运行数据库"],1,"镜像是只读模板；容器是镜像创建出来的运行实例。",false],
  [23,"ship","生产可靠性护航","处理超时、重试、熔断思维和可观测性，让服务更稳。","🧭",55,"进阶","生产系统需要明确的超时预算、有限重试、退避策略、结构化日志和健康检查。",["为外部调用设置超时","实现有限次数的指数退避","区分存活探针和就绪探针"],["Timeout Budget","Retry / Backoff","Health Check / Observability"],"为飞船安装故障保护","设计一个外部服务调用策略，避免无限重试和重试风暴。",["设置总超时与单次超时","只对可重试错误进行有限重试","为每次尝试记录结构化日志"],"重试次数有上限，退避可解释，日志能关联一次请求。","import asyncio\\n\\nasync def retry(operation, attempts=3):\\n    for index in range(attempts):\\n        try:\\n            return await operation()\\n        except TemporaryError:\\n            if index == attempts - 1:\\n                raise\\n            await asyncio.sleep(0.2 * (2 ** index))","为什么重试策略通常需要次数上限和指数退避？",["让代码更短","避免持续放大故障与请求风暴","保证请求一定成功","减少所有日志"],1,"有限重试和退避能控制负载，避免下游故障时不断叠加请求。",false],
  [24,"ship","AI 代码评审官","不只看代码能不能跑，还要判断它是否正确、安全、可维护。","🧐",55,"进阶","建立结构化 Code Review 维度：正确性、边界、测试、安全、性能和可维护性。",["区分阻断问题与建议项","用证据定位代码问题","写出可执行的修复建议"],["Correctness","Security / Performance","Review Severity"],"审查 AI 生成的补丁","对一段 AI 生成的 API 代码做评审，至少发现 5 个具体问题并给出证据。",["检查空值、边界和异常路径","检查认证、权限和数据访问","检查并发、资源关闭和测试缺口"],"评审报告包含文件位置、严重程度、影响、复现条件和建议。","# Review checklist\\n# 1. Is input validated?\\n# 2. Are permissions checked?\\n# 3. Are errors observable?\\n# 4. Are retries bounded?\\n# 5. Are edge cases tested?","一条高质量代码评审意见最重要的特征是什么？",["只说“代码不好”","指出具体位置、影响、复现条件和修复方向","只评价作者水平","尽可能写得很长"],1,"评审意见要可验证、可行动，并说明问题为什么重要。",false],
  [25,"ship","最终项目：蓝图任务","设计 Python AI Code Evaluation Service 的架构与数据模型。","🗺️",60,"项目关","把需求拆成 API、任务、执行 Worker、结果和报告，先画清楚边界。",["定义核心实体和状态流转","设计 API 契约","识别执行不可信代码的安全边界"],["Task / Submission / Run","状态机","信任边界与威胁建模"],"绘制评估系统蓝图","设计评估任务提交、执行、结果查询和报告导出的 API 与数据模型。",["定义任务状态：queued / running / passed / failed","设计请求响应 Schema","画出 API、数据库、Worker 的数据流"],"提交架构图或文字设计、接口清单和至少 3 个风险点。","# Task lifecycle\\nqueued -> running -> passed\\n                   -> failed\\n\\n# Keep API, orchestration, and\\n# untrusted execution in separate boundaries.","为什么不能把用户提交的代码直接在 Web API 进程里 exec()？",["因为 Python 没有 exec","不可信代码可能访问进程权限、文件和网络，破坏服务边界","exec 只能运行整数","会自动清空数据库"],1,"不可信代码必须在强隔离、资源受限的执行环境中运行，不能与 API 服务共享权限。",false],
  [26,"ship","最终项目：API 控制台","实现任务提交、状态查询和结构化结果接口。","🎛️",65,"项目关","按分层架构实现评估任务 API，使用数据库保存任务和状态。",["实现创建任务和查询详情","校验提交内容和状态转换","返回稳定的错误结构"],["FastAPI Router","Pydantic Schema","Repository / Service"],"启动评估控制台","实现 POST /evaluations、GET /evaluations/{id} 和列表分页接口。",["创建 ORM 模型和迁移","实现 service 层状态管理","编写 API 单元与集成测试"],"任务创建后返回 ID，查询接口能读到持久化状态。","@router.post('/evaluations', status_code=202)\\ndef submit(payload: EvaluationCreate, service: EvaluationServiceDep):\\n    task = service.submit(payload)\\n    return {'id': task.id, 'status': task.status}","HTTP 202 Accepted 对异步任务提交最合适的含义是什么？",["任务已永久成功","请求已接受，处理可能尚未完成","请求语法错误","资源已删除"],1,"202 表示请求已接受处理，但最终结果尚未产生或确认。",false],
  [27,"ship","最终项目：Worker 竞技场","把测试执行放进独立 Worker，收集结果并控制资源。","🤖",70,"项目关","实现 API 与 Worker 解耦，执行预定义测试，记录退出码、日志和耗时。",["设计 Worker 任务领取机制","设置超时和资源限制","收集结构化测试结果"],["Worker Queue","Subprocess Timeout","Execution Isolation"],"建造安全测试跑道","实现一个 Worker 原型：读取任务、运行受控测试命令、保存结果。",["Worker 不直接接收任意 shell 命令","对运行时间和输出大小设限","执行完成后更新任务状态"],"Worker 失败不会拖垮 API；任务状态最终可追踪。","import subprocess\\n\\nresult = subprocess.run(\\n    ['pytest', '-q'],\\n    capture_output=True, text=True, timeout=30, check=False\\n)\\nprint(result.returncode)","subprocess.run 的 timeout 参数主要防止什么？",["输出乱码","子进程无限运行占用资源","测试用例被发现","Python 自动升级"],1,"timeout 限制子进程执行时长，超时后会终止并抛出 TimeoutExpired。",false],
  [28,"ship","最终项目：质量与安全加固","用测试、隔离和静态检查给项目做一次发版前体检。","🧰",65,"项目关","完善单元、集成和端到端测试，加入 Ruff、Mypy 与执行环境安全限制。",["为状态机和异常路径补测试","运行 Ruff 与 Mypy","限制 Worker 网络、权限和资源"],["Test Pyramid","Ruff / Mypy","Container Hardening"],"修复发版前最后一批 Bug","针对重复提交、任务超时、Worker 崩溃和超大输出增加保护与测试。",["测试重复提交和幂等性","测试 Worker 超时和失败恢复","检查非 root、只读文件系统和网络限制"],"核心测试通过；安全限制有文档说明；没有把 Docker Socket 暴露给不可信代码。","# Example quality gates\\nruff check .\\nmypy src\\npytest -q --cov=src --cov-report=term-missing","对执行不可信代码的容器，哪项配置最不应该省略？",["给容器 root 权限","CPU / 内存 / 时间限制与最小权限","挂载宿主机根目录","开放全部网络"],1,"隔离执行环境必须采用最小权限并限制资源，避免资源耗尽和越权访问。",false],
  [29,"ship","作品集与技术表达","把工程成果整理成别人看得懂、能复现、敢信任的作品。","📚",50,"交付关","写清楚项目价值、架构、启动方式、测试结果、限制和安全边界。",["撰写清晰 README","记录架构决策和 API 示例","总结技术取舍与已知限制"],["README 结构","Architecture Decision","Reproducibility"],"发布你的冒险手册","为最终项目写英文 README，并整理一份代码评估报告样例。",["说明问题、功能和技术栈","提供一键启动和测试步骤","展示架构图、样例输出和安全限制"],"陌生开发者能按文档启动项目并运行测试。","# Python AI Code Evaluation Service\\n\\n## Features\\n- Submit and track evaluations\\n- Isolated test workers\\n- Structured result reports\\n\\n## Quick start\\ndocker compose up --build","高质量 README 最重要的目标是什么？",["展示作者用了多少技术名词","帮助读者理解、运行、验证和评估项目","替代自动化测试","隐藏项目限制"],1,"README 应帮助读者快速理解项目并复现关键步骤，同时诚实说明限制。",false],
  [30,"ship","终极 Boss：独立交付","最后一战：把 30 天所学变成一个真实可展示的工程成果。","👑",90,"终极 Boss","完成一个端到端 Python 工程项目，并用测试和评审报告证明它可靠。",["端到端演示核心工作流","通过测试、静态检查和安全检查","完成英文项目说明与评估报告"],["系统设计","质量门禁","工程交付与复盘"],"交付 Python AI Code Evaluation Service","从提交评估任务开始，经过 Worker 执行，最终生成可查询的结构化评估报告。",["演示完整任务状态流转","展示自动化测试和质量检查结果","提交架构说明、风险清单和后续路线图"],"可复现的 GitHub 项目、通过的核心测试、英文 README 和一份专业 Code Review 报告。","# A good delivery is more than code.\\n# It includes tests, observability,\\n# security boundaries, and clear docs.\\n\\nprint('Quest complete. Ship it!')","真正的工程交付，以下哪一项最完整？",["代码能在作者电脑运行","代码、测试、可观测性、安全边界和可复现文档","只要有漂亮的 UI","只要 AI 说没问题"],1,"工程交付需要可验证的正确性、可运维性、安全边界和可复现文档，而不只是“能跑”。",true]
];

const days = rawDays.map(function (row) {
  return {
    day: row[0], zone: row[1], title: row[2], subtitle: row[3], emoji: row[4],
    minutes: row[5], level: row[6], summary: row[7], goals: row[8], concepts: row[9],
    missionTitle: row[10], mission: row[11], steps: row[12], deliverable: row[13],
    code: row[14].replace(/\\n/g, "\n"), question: row[15], options: row[16], answer: row[17],
    explain: row[18], boss: row[19]
  };
});

const storageKey = "python-quest-progress-v1";
const defaultState = { completed: [], practice: {}, xp: 0, streak: 0, lastActiveDate: "", theme: "light" };
let state = loadState();
let activeDay = null;
let activeTab = "learn";
let selectedAnswer = null;
let quizPassed = false;
let practiceDone = false;
let timerSeconds = 25 * 60;
let timerInterval = null;
let timerRunning = false;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return Object.assign({}, defaultState, saved, {
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      practice: saved.practice && typeof saved.practice === "object" ? saved.practice : {}
    });
  } catch (error) {
    return Object.assign({}, defaultState);
  }
}
function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
function dateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}
function touchStreak() {
  const today = dateKey(new Date());
  if (state.lastActiveDate === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  state.streak = state.lastActiveDate === dateKey(yesterday) ? (state.streak || 0) + 1 : 1;
  state.lastActiveDate = today;
  saveState();
}
function firstUncompleted() {
  return days.find(function (day) { return !state.completed.includes(day.day); }) || days[days.length - 1];
}
function xpFor(day) { return day.boss ? 100 : 50; }
function rankFor(xp) {
  const ranks = [
    { min: 0, name: "代码萌新", title: "Python 新手村居民" },
    { min: 150, name: "代码探险家", title: "正在探索 Python 世界" },
    { min: 450, name: "技能猎手", title: "可以独立完成小型项目" },
    { min: 850, name: "Python 巫师", title: "掌握后端与质量工程" },
    { min: 1250, name: "工程架构师", title: "能够交付可靠系统" },
    { min: 1600, name: "传奇交付者", title: "Python Quest 全成就" }
  ];
  let current = ranks[0];
  let next = null;
  for (let i = 0; i < ranks.length; i += 1) {
    if (xp >= ranks[i].min) current = ranks[i];
    else { next = ranks[i]; break; }
  }
  return { current: current, next: next };
}
function levelInfo(xp) {
  const level = Math.floor(xp / 100) + 1;
  return { level: level, into: xp % 100, remaining: 100 - (xp % 100) };
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
  });
}
function showToast(message) {
  const region = document.getElementById("toastRegion");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  region.appendChild(toast);
  window.setTimeout(function () { toast.remove(); }, 2800);
}
function renderStats() {
  const completed = state.completed.length;
  const progress = Math.round((completed / days.length) * 100);
  const rank = rankFor(state.xp);
  const level = levelInfo(state.xp);
  document.getElementById("topXp").textContent = state.xp + " XP";
  document.getElementById("statXp").innerHTML = state.xp + " <small>XP</small>";
  document.getElementById("statStreak").innerHTML = (state.streak || 0) + " <small>天</small>";
  document.getElementById("statLessons").innerHTML = completed + " <small>/ 30</small>";
  document.getElementById("statRank").textContent = rank.current.name;
  document.getElementById("rankNext").textContent = rank.next ? "下一个称号：" + rank.next.name : "已解锁全部称号！";
  document.getElementById("heroProgress").style.width = progress + "%";
  document.getElementById("heroProgressText").textContent = progress + "% 已探索";
  document.getElementById("levelProgress").style.width = level.into + "%";
  document.getElementById("levelProgressText").textContent = level.into + " / 100 XP";
  document.getElementById("playerLevel").textContent = "LV." + level.level;
  document.getElementById("playerTitle").textContent = rank.current.title;
}
function renderMap() {
  const root = document.getElementById("worldMap");
  root.innerHTML = zones.map(function (zone) {
    const zoneDays = days.filter(function (day) { return day.zone === zone.id; });
    const done = zoneDays.filter(function (day) { return state.completed.includes(day.day); }).length;
    const nodes = zoneDays.map(function (day) {
      const isDone = state.completed.includes(day.day);
      const isCurrent = !isDone && day.day === firstUncompleted().day;
      const classes = ["day-node"];
      if (isDone) classes.push("done");
      if (isCurrent) classes.push("current");
      if (day.boss) classes.push("boss-node");
      return '<button class="' + classes.join(" ") + '" data-day="' + day.day + '" aria-label="第 ' + day.day + ' 天：' + escapeHtml(day.title) + '">' +
        '<span class="day-number">DAY ' + String(day.day).padStart(2, "0") + '</span>' +
        '<span class="day-emoji">' + day.emoji + '</span>' +
        '<span class="day-name">' + escapeHtml(day.title) + '</span></button>';
    }).join("");
    return '<section class="zone-card ' + zone.theme + '" data-symbol="' + zone.symbol + '">' +
      '<div class="zone-header"><div class="zone-emoji">' + zone.emoji + '</div>' +
      '<div class="zone-heading"><h3>' + zone.name + '</h3><p>' + zone.subtitle + '</p></div>' +
      '<div class="zone-progress"><strong>' + done + ' / ' + zoneDays.length + '</strong>已通关</div></div>' +
      '<div class="day-grid">' + nodes + '</div></section>';
  }).join("");
}
function renderDailyQuest() {
  const day = firstUncompleted();
  const date = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date());
  document.getElementById("todayDate").textContent = date;
  const isDone = state.completed.length === days.length;
  document.getElementById("dailyQuest").innerHTML = isDone ?
    '<div class="quest-icon">🏆</div><div class="quest-copy"><span class="quest-label">QUEST COMPLETE</span><h3>你已经完成全部 30 天冒险！</h3><p>真正的旅程刚刚开始。复习任意关卡，继续打磨你的毕业项目。</p><div class="quest-reward">✦ 传奇交付者已解锁</div></div><div class="quest-action"><button class="button button-primary" data-day="30">重温最终挑战 →</button></div>' :
    '<div class="quest-icon">' + day.emoji + '</div><div class="quest-copy"><span class="quest-label">DAY ' + String(day.day).padStart(2, "0") + ' · ' + day.zone.toUpperCase() + '</span><h3>' + escapeHtml(day.title) + '</h3><p>' + escapeHtml(day.summary) + '</p><div class="quest-reward">✦ 通关奖励 +' + xpFor(day) + ' XP　 ·　⏱ ' + day.minutes + ' 分钟</div></div><div class="quest-action"><button class="button button-primary" data-day="' + day.day + '">开始今日任务 →</button></div>';
}
const badgeDefinitions = [
  { name: "初次出发", icon: "🚩", unlocked: function () { return state.completed.length >= 1; } },
  { name: "三日连胜", icon: "🔥", unlocked: function () { return state.streak >= 3; } },
  { name: "森林毕业", icon: "🌲", unlocked: function () { return [1,2,3,4,5,6,7].every(function (n) { return state.completed.includes(n); }); } },
  { name: "API 魔法师", icon: "🏰", unlocked: function () { return [8,9,10,11,12,13,14].every(function (n) { return state.completed.includes(n); }); } },
  { name: "Bug 猎人", icon: "🐞", unlocked: function () { return [15,16,17,18,19,20,21].every(function (n) { return state.completed.includes(n); }); } },
  { name: "部署船长", icon: "🚀", unlocked: function () { return [22,23,24,25,26,27,28,29,30].every(function (n) { return state.completed.includes(n); }); } },
  { name: "半程勇者", icon: "⭐", unlocked: function () { return state.completed.length >= 15; } },
  { name: "传奇交付者", icon: "👑", unlocked: function () { return state.completed.length === 30; } }
];
function renderTrophies() {
  const unlocked = badgeDefinitions.filter(function (badge) { return badge.unlocked(); }).length;
  document.getElementById("badgeCount").textContent = unlocked + " / " + badgeDefinitions.length;
  document.getElementById("trophyGrid").innerHTML = badgeDefinitions.map(function (badge) {
    const active = badge.unlocked();
    return '<div class="trophy-item ' + (active ? "unlocked" : "") + '" title="' + badge.name + (active ? " · 已解锁" : " · 未解锁") + '">' + badge.icon + '<span>' + badge.name + '</span></div>';
  }).join("");
}
function renderApp() {
  renderStats();
  renderMap();
  renderDailyQuest();
  renderTrophies();
  document.body.classList.toggle("dark", state.theme === "dark");
  document.getElementById("themeToggle").textContent = state.theme === "dark" ? "☀" : "☾";
}
function openLesson(dayNumber) {
  const day = days.find(function (item) { return item.day === Number(dayNumber); });
  if (!day) return;
  activeDay = day;
  activeTab = "learn";
  selectedAnswer = null;
  quizPassed = false;
  practiceDone = Boolean(state.practice[day.day]);
  renderLesson();
  const modal = document.getElementById("lessonModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLesson() {
  const modal = document.getElementById("lessonModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function switchTab(tab) {
  activeTab = tab;
  renderLesson();
}
function renderLesson() {
  if (!activeDay) return;
  const day = activeDay;
  const zone = zones.find(function (item) { return item.id === day.zone; });
  document.getElementById("lessonKicker").textContent = "DAY " + String(day.day).padStart(2, "0") + " · " + zone.name.toUpperCase();
  document.getElementById("lessonDayBubble").textContent = String(day.day).padStart(2, "0");
  document.getElementById("lessonTitle").textContent = day.title;
  document.getElementById("lessonSubtitle").textContent = day.subtitle;
  document.getElementById("lessonMeta").innerHTML = '<span class="meta-chip">⏱ ' + day.minutes + ' 分钟</span><span class="meta-chip">✦ +' + xpFor(day) + ' XP</span><span class="meta-chip">' + day.level + '</span>' + (day.boss ? '<span class="meta-chip">👑 Boss 战</span>' : "");
  document.querySelectorAll(".lesson-tab").forEach(function (tab) { tab.classList.toggle("active", tab.dataset.tab === activeTab); });
  const completed = state.completed.includes(day.day);
  const content = document.getElementById("lessonContent");
  if (activeTab === "learn") {
    content.innerHTML = (completed ? '<div class="lesson-intro">🏅 这一关已经通关！你可以随时回来复习，重复练习不会重复领取 XP。</div>' : '') +
      '<div class="lesson-intro">' + escapeHtml(day.summary) + '</div>' +
      '<h3 class="content-heading">🎯 本关技能目标</h3><div class="objective-list">' +
      day.goals.map(function (goal) { return '<div class="objective-item"><span>✓</span>' + escapeHtml(goal) + '</div>'; }).join("") +
      '</div><h3 class="content-heading">🧠 关键知识卡</h3><div class="concept-chips">' +
      day.concepts.map(function (concept) { return '<span class="concept-chip">' + escapeHtml(concept) + '</span>'; }).join("") +
      '</div><h3 class="content-heading">📚 官方资料补给站</h3><div class="resource-list">' +
      resourceMap[day.zone].map(function (resource) { return '<a class="resource-link" href="' + resource.url + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(resource.label) + '<span>↗</span></a>'; }).join("") +
      '</div><h3 class="content-heading">💻 代码观察站</h3><div class="code-window"><div class="code-window-head"><span><span class="code-dots"><i></i><i></i><i></i></span>　example.py</span><button class="copy-code" id="copyCode">复制代码 ↗</button></div><pre><code id="lessonCode">' + escapeHtml(day.code) + '</code></pre></div>';
    document.getElementById("lessonFooterHint").textContent = "读完知识卡，去实战任务里动手试试";
    document.getElementById("lessonNextButton").innerHTML = '去做实战任务 <span>→</span>';
  } else if (activeTab === "mission") {
    content.innerHTML = '<div class="mission-card"><span class="quiz-label">YOUR MISSION</span><h3>' + escapeHtml(day.missionTitle) + '</h3><p>' + escapeHtml(day.mission) + '</p><h3 class="content-heading">任务步骤</h3><ul>' +
      day.steps.map(function (step) { return '<li>' + escapeHtml(step) + '</li>'; }).join("") +
      '</ul><div class="deliverable"><strong>🎁 通关交付物：</strong>' + escapeHtml(day.deliverable) + '</div></div>' +
      '<label class="practice-check"><input type="checkbox" id="practiceCheckbox" ' + (practiceDone ? "checked" : "") + '> 我已经亲手完成实战任务（不是只看懂代码）</label>' +
      '<p class="trophy-hint">小提示：可以使用自己的编辑器完成任务。这里的勾选是你的学习承诺。</p>';
    document.getElementById("lessonFooterHint").textContent = practiceDone ? "实战已打卡，接下来验证知识掌握情况" : "完成实战后勾选，再去闯关答题";
    document.getElementById("lessonNextButton").innerHTML = '去闯关答题 <span>→</span>';
  } else {
    const letters = ["A", "B", "C", "D"];
    content.innerHTML = '<div class="quiz-card"><span class="quiz-label">KNOWLEDGE CHECK · DAY ' + String(day.day).padStart(2, "0") + '</span><div class="quiz-question">' + escapeHtml(day.question) + '</div><div class="quiz-options">' +
      day.options.map(function (option, index) {
        let cls = "quiz-option";
        if (selectedAnswer === index) cls += " selected";
        if (quizPassed && index === day.answer) cls += " correct";
        if (quizPassed && selectedAnswer === index && index !== day.answer) cls += " wrong";
        return '<button class="' + cls + '" data-answer="' + index + '"><span class="option-letter">' + letters[index] + '</span>' + escapeHtml(option) + '</button>';
      }).join("") +
      '</div><div class="quiz-feedback ' + (quizPassed ? "show" : "") + '">' + (quizPassed ? "🎉 答对啦！" + escapeHtml(day.explain) : "选一个你认为正确的答案，再点击下方“检查答案”。") + '</div></div>' +
      (!practiceDone ? '<div class="deliverable" style="margin-top:12px">🧩 记得完成实战任务并在上一页打卡，才能领取本关奖励。</div>' : '');
    document.getElementById("lessonFooterHint").textContent = quizPassed ? (completed ? "已通关，可以继续复习或挑战下一关" : (practiceDone ? "知识验证通过，准备领取奖励" : "答题通过！再完成实战任务即可通关")) : "选好答案后检查，答对即可通过知识验证";
    document.getElementById("lessonNextButton").innerHTML = quizPassed ? (completed ? '完成复习 <span>✓</span>' : (practiceDone ? '领取通关奖励 <span>✦</span>' : '完成实战任务 <span>→</span>')) : '检查答案 <span>→</span>';
  }
}
function completeDay() {
  if (!activeDay) return;
  if (!state.completed.includes(activeDay.day)) {
    state.completed.push(activeDay.day);
    state.xp += xpFor(activeDay);
    state.completed.sort(function (a, b) { return a - b; });
    saveState();
    renderApp();
    showToast("🎉 通关成功！ +" + xpFor(activeDay) + " XP 已到账");
  } else {
    showToast("这关你已经通关啦，复习也很棒！");
  }
  renderLesson();
}
function checkAnswer() {
  if (!activeDay) return;
  if (selectedAnswer === null) {
    showToast("先选择一个答案再提交哦！");
    return;
  }
  if (selectedAnswer !== activeDay.answer) {
    quizPassed = false;
    renderLesson();
    showToast("再想一想，看看知识卡里的线索 👀");
    return;
  }
  quizPassed = true;
  if (practiceDone) completeDay();
  else {
    renderLesson();
    showToast("答对啦！完成实战打卡即可领取奖励。");
  }
}
function nextLessonAction() {
  if (activeTab === "learn") switchTab("mission");
  else if (activeTab === "mission") switchTab("quiz");
  else if (quizPassed && !practiceDone) switchTab("mission");
  else if (quizPassed && practiceDone) {
    const next = days.find(function (day) { return day.day > activeDay.day && !state.completed.includes(day.day); });
    if (next) openLesson(next.day);
    else closeLesson();
  } else checkAnswer();
}
function initTimer() {
  const display = document.getElementById("timerDisplay");
  const start = document.getElementById("timerStart");
  const status = document.getElementById("timerStatus");
  function paint() {
    const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
    const secs = String(timerSeconds % 60).padStart(2, "0");
    display.textContent = mins + ":" + secs;
  }
  start.addEventListener("click", function () {
    if (timerRunning) {
      window.clearInterval(timerInterval);
      timerInterval = null;
      timerRunning = false;
      start.textContent = "继续专注";
      status.textContent = "暂停一下也没关系";
      return;
    }
    if (timerSeconds <= 0) timerSeconds = 25 * 60;
    timerRunning = true;
    start.textContent = "暂停";
    status.textContent = "专注中 · 你正在积累经验";
    timerInterval = window.setInterval(function () {
      timerSeconds -= 1;
      paint();
      if (timerSeconds <= 0) {
        window.clearInterval(timerInterval);
        timerInterval = null;
        timerRunning = false;
        timerSeconds = 0;
        start.textContent = "再来一轮";
        status.textContent = "🎉 专注完成！起来活动一下吧";
        showToast("🍃 25 分钟专注完成，给自己一个赞！");
      }
    }, 1000);
  });
  document.getElementById("timerReset").addEventListener("click", function () {
    window.clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
    timerSeconds = 25 * 60;
    start.textContent = "开始专注";
    status.textContent = "准备好就出发吧";
    paint();
  });
  paint();
}
function exportProgress() {
  const payload = {
    app: "Python Quest · 30 天冒险学院",
    exportedAt: new Date().toISOString(),
    completedDays: state.completed,
    completedCount: state.completed.length,
    xp: state.xp,
    streak: state.streak,
    practice: state.practice
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "python-quest-progress.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("学习存档已导出！");
}
function bindEvents() {
  document.getElementById("worldMap").addEventListener("click", function (event) {
    const button = event.target.closest("[data-day]");
    if (button) openLesson(button.dataset.day);
  });
  document.getElementById("dailyQuest").addEventListener("click", function (event) {
    const button = event.target.closest("[data-day]");
    if (button) openLesson(button.dataset.day);
  });
  document.getElementById("continueButton").addEventListener("click", function () {
    openLesson(firstUncompleted().day);
  });
  document.getElementById("finalBossButton").addEventListener("click", function () { openLesson(30); });
  document.getElementById("surpriseButton").addEventListener("click", function () {
    const pick = days[Math.floor(Math.random() * days.length)];
    openLesson(pick.day);
    switchTab("quiz");
    showToast("🎁 今日惊喜：第 " + pick.day + " 天 · " + pick.title);
  });
  document.getElementById("themeToggle").addEventListener("click", function () {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState();
    renderApp();
  });
  document.getElementById("profileButton").addEventListener("click", function () {
    showToast("你好，冒险者！你的学习进度保存在当前浏览器中。");
  });
  document.getElementById("exportButton").addEventListener("click", exportProgress);
  document.getElementById("closeLesson").addEventListener("click", closeLesson);
  document.querySelector("[data-close-modal]").addEventListener("click", closeLesson);
  document.getElementById("lessonNextButton").addEventListener("click", nextLessonAction);
  document.querySelector(".lesson-tabs").addEventListener("click", function (event) {
    const tab = event.target.closest("[data-tab]");
    if (tab) switchTab(tab.dataset.tab);
  });
  document.getElementById("lessonContent").addEventListener("click", function (event) {
    const option = event.target.closest("[data-answer]");
    if (option) {
      selectedAnswer = Number(option.dataset.answer);
      quizPassed = false;
      renderLesson();
      return;
    }
    if (event.target.closest("#copyCode")) {
      const code = activeDay ? activeDay.code : "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () { showToast("代码已复制到剪贴板！"); }).catch(function () { showToast("复制失败，请手动选择代码。"); });
      } else showToast("当前浏览器不支持自动复制，请手动选择代码。");
    }
  });
  document.getElementById("lessonContent").addEventListener("change", function (event) {
    if (event.target.id === "practiceCheckbox") {
      practiceDone = event.target.checked;
      state.practice[activeDay.day] = practiceDone;
      saveState();
      renderLesson();
      if (practiceDone) showToast("实战打卡已记录，去答题领取 XP 吧！");
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLesson();
  });
}
touchStreak();
renderApp();
initTimer();
bindEvents();
