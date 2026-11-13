/* Python Quest browser coding challenges.
 * Exercises test pure Python concepts. Engineering-specific tooling tasks still
 * require completing the main mission in a real development environment.
 * Tests execute in the learner's own browser and are NOT anti-cheat proofs.
 */
window.QuestChallenges = [
  {
    day: 1, task: "给勇者制作个人徽章", signature: "make_badge(name, level)",
    hint: "用 f-string 拼接名字和等级，注意分隔符是一个空格、一个中点、再一个空格。",
    starter: "def make_badge(name, level):\n    # 返回如 'Ada · Lv.3' 的文字徽章\n    raise NotImplementedError",
    tests: [
      ["普通徽章", "assert make_badge('Ada', 3) == 'Ada · Lv.3'"],
      ["等级为零", "assert make_badge('Py', 0) == 'Py · Lv.0'"],
      ["中文名字", "assert make_badge('冒险者', 12) == '冒险者 · Lv.12'"]
    ]
  },
  {
    day: 2, task: "整理不重复的背包", signature: "dedupe_items(items)",
    hint: "set 可以去重，但不保证保留输入顺序；试试循环和 seen 集合。",
    starter: "def dedupe_items(items):\n    # 返回去重且保持原顺序的新列表\n    raise NotImplementedError",
    tests: [
      ["重复装备", "assert dedupe_items(['剑', '盾', '剑', '地图']) == ['剑', '盾', '地图']"],
      ["空背包", "assert dedupe_items([]) == []"],
      ["顺序不变", "assert dedupe_items([3, 2, 3, 1, 2]) == [3, 2, 1]"]
    ]
  },
  {
    day: 3, task: "实现暴击伤害公式", signature: "calculate_damage(base, multiplier=1.0)",
    hint: "返回 base * multiplier；基础伤害小于 0 时应抛出 ValueError。",
    starter: "def calculate_damage(base, multiplier=1.0):\n    raise NotImplementedError",
    tests: [
      ["基础伤害", "assert calculate_damage(10) == 10"],
      ["暴击倍率", "assert calculate_damage(20, 1.5) == 30"],
      ["拒绝负值", "try:\n    calculate_damage(-1)\n    assert False, '应抛出 ValueError'\nexcept ValueError:\n    pass"]
    ]
  },
  {
    day: 4, task: "安全解析物品数量", signature: "parse_quantity(raw)",
    hint: "可以用 int()；但 -1 应主动抛出 ValueError。",
    starter: "def parse_quantity(raw):\n    raise NotImplementedError",
    tests: [
      ["转换数值", "assert parse_quantity('8') == 8"],
      ["允许零", "assert parse_quantity('0') == 0"],
      ["错误字符串", "try:\n    parse_quantity('oops')\n    assert False\nexcept ValueError:\n    pass"],
      ["禁止负数", "try:\n    parse_quantity('-4')\n    assert False\nexcept ValueError:\n    pass"]
    ]
  },
  {
    day: 5, task: "制作按需掉落生成器", signature: "loot_stream(items)",
    hint: "逐项 yield，不要一次返回整个列表。",
    starter: "def loot_stream(items):\n    # 使用 yield 逐项产出\n    raise NotImplementedError",
    tests: [
      ["顺序掉落", "assert list(loot_stream(['金币', '地图'])) == ['金币', '地图']"],
      ["空掉落", "assert list(loot_stream([])) == []"],
      ["生成器类型", "import inspect\nassert inspect.isgenerator(loot_stream([1]))"]
    ]
  },
  {
    day: 6, task: "给函数增加日志装饰器", signature: "announce(fn)",
    hint: "返回 wrapper，调用函数前 print('技能发动！')，记得使用 functools.wraps。",
    starter: "from functools import wraps\n\ndef announce(fn):\n    raise NotImplementedError",
    tests: [
      ["函数结果保持", "@announce\ndef add(a, b):\n    return a + b\nassert add(2, 3) == 5"],
      ["保留原名", "@announce\ndef heal():\n    return 100\nassert heal.__name__ == 'heal'"],
      ["输出宣言", "import io, contextlib\nbuf=io.StringIO()\n@announce\ndef ping(): return 1\nwith contextlib.redirect_stdout(buf): ping()\nassert '技能发动！' in buf.getvalue()"]
    ]
  },
  {
    day: 7, task: "保存并恢复英雄档案", signature: "save_profile(profile) / load_profile(raw)",
    hint: "使用 json.dumps 和 json.loads；支持非 ASCII 中文。",
    starter: "import json\n\ndef save_profile(profile):\n    raise NotImplementedError\n\ndef load_profile(raw):\n    raise NotImplementedError",
    tests: [
      ["保存是 JSON 字符串", "raw=save_profile({'name':'Py','xp':30})\nassert isinstance(raw,str)\nassert json.loads(raw)['xp']==30"],
      ["恢复信息", "assert load_profile('{\"name\":\"Ada\",\"xp\":80}') == {'name':'Ada','xp':80}"],
      ["中文可还原", "hero={'name':'勇者','items':['钥匙']}\nassert load_profile(save_profile(hero)) == hero"]
    ]
  },
  {
    day: 8, task: "生成健康检查响应", signature: "health_payload(version='1.0')",
    hint: "返回 status 和 version 两个键。",
    starter: "def health_payload(version='1.0'):\n    raise NotImplementedError",
    tests: [
      ["默认状态", "assert health_payload() == {'status':'ok','version':'1.0'}"],
      ["可设版本", "assert health_payload('2.1')['version']=='2.1'"]
    ]
  },
  {
    day: 9, task: "校验新角色的注册信息", signature: "validate_hero(name, level)",
    hint: "姓名至少两个字符、等级范围 1 到 99；不符合时抛出 ValueError。",
    starter: "def validate_hero(name, level):\n    # 合法时返回 {'name': name, 'level': level}\n    raise NotImplementedError",
    tests: [
      ["有效角色", "assert validate_hero('Ada',5)=={'name':'Ada','level':5}"],
      ["等级上限", "assert validate_hero('Py',99)['level']==99"],
      ["名字过短", "try:\n    validate_hero('A',2)\n    assert False\nexcept ValueError: pass"],
      ["非法等级", "try:\n    validate_hero('Ada',100)\n    assert False\nexcept ValueError: pass"]
    ]
  },
  {
    day: 10, task: "在任务列表中查询任务", signature: "find_task(tasks, task_id)",
    hint: "模拟数据库查询：匹配 id，未找到返回 None。",
    starter: "def find_task(tasks, task_id):\n    # tasks 是字典列表\n    raise NotImplementedError",
    tests: [
      ["找到记录", "tasks=[{'id':1,'title':'修复'}, {'id':2,'title':'测试'}]\nassert find_task(tasks,2)['title']=='测试'"],
      ["未找到", "assert find_task([{'id':5}],6) is None"],
      ["空记录", "assert find_task([],1) is None"]
    ]
  },
  {
    day: 11, task: "实现幂等领取逻辑", signature: "claim_once(claimed, request_id)",
    hint: "claimed 是 set；首次添加返回 True，重复出现返回 False。",
    starter: "def claim_once(claimed, request_id):\n    raise NotImplementedError",
    tests: [
      ["首次领取成功", "claimed=set()\nassert claim_once(claimed,'abc') is True\nassert 'abc' in claimed"],
      ["再次领取无奖励", "claimed={'abc'}\nassert claim_once(claimed,'abc') is False\nassert len(claimed)==1"],
      ["不同请求", "claimed=set()\nassert claim_once(claimed,'a') and claim_once(claimed,'b')"]
    ]
  },
  {
    day: 12, task: "处理 HTTP 响应状态", signature: "extract_status(response)",
    hint: "输入是 {'status': 200, 'data': {...}}，成功时返回 data；非 2xx 抛 ValueError。",
    starter: "def extract_status(response):\n    raise NotImplementedError",
    tests: [
      ["成功", "assert extract_status({'status':200,'data':{'ok':True}})=={'ok':True}"],
      ["创建成功", "assert extract_status({'status':201,'data':5})==5"],
      ["失败错误", "try:\n    extract_status({'status':503,'data':None})\n    assert False\nexcept ValueError: pass"]
    ]
  },
  {
    day: 13, task: "并发侦察多个目的地", signature: "async scout_all(names)",
    hint: "定义 async 函数，使用 asyncio.gather 并发调用子协程，返回加上 ✓ 的名字列表。",
    starter: "import asyncio\n\nasync def scout_all(names):\n    raise NotImplementedError",
    tests: [
      ["多个目标", "import asyncio\nassert asyncio.run(scout_all(['北岛','南岛'])) == ['北岛 ✓','南岛 ✓']"],
      ["空目标", "import asyncio\nassert asyncio.run(scout_all([])) == []"],
      ["异步函数", "import inspect\nassert inspect.iscoroutinefunction(scout_all)"]
    ]
  },
  {
    day: 14, task: "编写 API 列表分页器", signature: "paginate(items, page, size)",
    hint: "页码从 1 开始，非法 page / size 抛 ValueError。",
    starter: "def paginate(items, page, size):\n    raise NotImplementedError",
    tests: [
      ["第一页", "assert paginate([0,1,2,3,4],1,2)==[0,1]"],
      ["末页", "assert paginate([0,1,2,3,4],3,2)==[4]"],
      ["非法页码", "try:\n    paginate([1],0,2)\n    assert False\nexcept ValueError: pass"],
      ["空页", "assert paginate([1,2],3,2)==[]"]
    ]
  },
  {
    day: 15, task: "防止平均数除零错误", signature: "average_or_zero(values)",
    hint: "空列表返回 0，非空时计算算术平均值。",
    starter: "def average_or_zero(values):\n    raise NotImplementedError",
    tests: [
      ["普通平均", "assert average_or_zero([2,4,6])==4"],
      ["空列表", "assert average_or_zero([])==0"],
      ["包含负值", "assert average_or_zero([-2,0,2])==0"]
    ]
  },
  {
    day: 16, task: "创建易于测试的 Mock 响应", signature: "build_mock_response(status, payload)",
    hint: "返回包含 status、data、ok 字段的字典。",
    starter: "def build_mock_response(status, payload):\n    raise NotImplementedError",
    tests: [
      ["成功模拟", "assert build_mock_response(200,{'id':1})=={'status':200,'data':{'id':1},'ok':True}"],
      ["失败模拟", "assert build_mock_response(500,None)['ok'] is False"],
      ["创建成功", "assert build_mock_response(201,'created')['ok'] is True"]
    ]
  },
  {
    day: 17, task: "归一化 API 测试结果", signature: "summarize_api_result(response)",
    hint: "返回 {'ok': bool, 'status': int}，2xx 为成功。",
    starter: "def summarize_api_result(response):\n    raise NotImplementedError",
    tests: [
      ["OK", "assert summarize_api_result({'status':200})=={'ok':True,'status':200}"],
      ["Not found", "assert summarize_api_result({'status':404})=={'ok':False,'status':404}"],
      ["No content", "assert summarize_api_result({'status':204})['ok'] is True"]
    ]
  },
  {
    day: 18, task: "安全扣减剩余库存", signature: "safe_decrement(stock, quantity)",
    hint: "当 quantity 非正或大于库存时抛 ValueError，否则返回扣减后的值。",
    starter: "def safe_decrement(stock, quantity):\n    raise NotImplementedError",
    tests: [
      ["正常扣减", "assert safe_decrement(10,3)==7"],
      ["刚好扣完", "assert safe_decrement(4,4)==0"],
      ["库存不足", "try:\n    safe_decrement(3,4)\n    assert False\nexcept ValueError: pass"],
      ["非法数量", "try:\n    safe_decrement(5,0)\n    assert False\nexcept ValueError: pass"]
    ]
  },
  {
    day: 19, task: "识别最慢的函数", signature: "top_slow_functions(profiles)",
    hint: "profiles 是 {'name','seconds'} 列表；按耗时降序返回函数名。",
    starter: "def top_slow_functions(profiles):\n    raise NotImplementedError",
    tests: [
      ["降序排序", "p=[{'name':'a','seconds':0.2},{'name':'b','seconds':1.5}]\nassert top_slow_functions(p)==['b','a']"],
      ["空记录", "assert top_slow_functions([])==[]"],
      ["三项", "p=[{'name':'x','seconds':3},{'name':'y','seconds':1},{'name':'z','seconds':2}]\nassert top_slow_functions(p)==['x','z','y']"]
    ]
  },
  {
    day: 20, task: "守护文件名安全", signature: "safe_filename(name)",
    hint: "禁止含有路径分隔符、.. 以及空名字，合法时返回原始名字。",
    starter: "def safe_filename(name):\n    raise NotImplementedError",
    tests: [
      ["安全名称", "assert safe_filename('note.txt')=='note.txt'"],
      ["路径穿越", "for name in ('../key','a/b','a\\\\b',''):\n    try:\n        safe_filename(name)\n        assert False, name\n    except ValueError: pass"],
      ["普通名字", "assert safe_filename('报告.json')=='报告.json'"]
    ]
  },
  {
    day: 21, task: "从日志中找出错误事件", signature: "diagnose_issue(logs)",
    hint: "logs 是字符串列表，返回包含 ERROR 或 FATAL（不区分大小写）的条目。",
    starter: "def diagnose_issue(logs):\n    raise NotImplementedError",
    tests: [
      ["错误提取", "lines=['INFO ready','ERROR timeout','WARN slow','fatal crash']\nassert diagnose_issue(lines)==['ERROR timeout','fatal crash']"],
      ["无错误", "assert diagnose_issue(['ok','warn'])==[]"],
      ["大小写", "assert diagnose_issue(['error fail'])==['error fail']"]
    ]
  },
  {
    day: 22, task: "生成 Docker 环境变量清单", signature: "docker_env(mapping)",
    hint: "按键名升序排列，拼接 KEY=value，每行一个。",
    starter: "def docker_env(mapping):\n    raise NotImplementedError",
    tests: [
      ["按键排序", "assert docker_env({'Z':'2','A':'1'})=='A=1\\nZ=2'"],
      ["空配置", "assert docker_env({})==''"],
      ["数字转换", "assert docker_env({'PORT':8000})=='PORT=8000'"]
    ]
  },
  {
    day: 23, task: "规划指数退避重试时间", signature: "retry_delays(attempts, base=0.2)",
    hint: "返回 attempts-1 个等待时间：base, 2*base, 4*base... attempts < 1 应报错。",
    starter: "def retry_delays(attempts, base=0.2):\n    raise NotImplementedError",
    tests: [
      ["一次不重试", "assert retry_delays(1)==[]"],
      ["三次尝试", "assert retry_delays(3)==[0.2,0.4]"],
      ["自定义间隔", "assert retry_delays(4,1)==[1,2,4]"],
      ["无效次数", "try:\n    retry_delays(0)\n    assert False\nexcept ValueError: pass"]
    ]
  },
  {
    day: 24, task: "检查危险代码模式", signature: "review_findings(code)",
    hint: "检测字符串中的 eval(、exec(；返回包含 'eval' 和/或 'exec' 的列表。",
    starter: "def review_findings(code):\n    raise NotImplementedError",
    tests: [
      ["发现 eval", "assert review_findings('x = eval(user)')==['eval']"],
      ["发现两种", "assert review_findings('eval(x); exec(y)')==['eval','exec']"],
      ["安全代码", "assert review_findings('print(42)')==[]"]
    ]
  },
  {
    day: 25, task: "实现评估任务状态机", signature: "next_state(current, event)",
    hint: "queued+start→running，running+pass→passed，running+fail→failed；非法转换抛 ValueError。",
    starter: "def next_state(current, event):\n    raise NotImplementedError",
    tests: [
      ["开始运行", "assert next_state('queued','start')=='running'"],
      ["成功", "assert next_state('running','pass')=='passed'"],
      ["失败", "assert next_state('running','fail')=='failed'"],
      ["不允许跳级", "try:\n    next_state('queued','pass')\n    assert False\nexcept ValueError: pass"]
    ]
  },
  {
    day: 26, task: "输出标准评估任务记录", signature: "evaluation_payload(task_id)",
    hint: "返回 {'id': task_id, 'status': 'queued', 'score': None}。",
    starter: "def evaluation_payload(task_id):\n    raise NotImplementedError",
    tests: [
      ["初始状态", "assert evaluation_payload('a1')=={'id':'a1','status':'queued','score':None}"],
      ["数值 ID", "assert evaluation_payload(5)['id']==5"]
    ]
  },
  {
    day: 27, task: "解析测试 Worker 的退出信息", signature: "parse_test_result(exitcode, stdout)",
    hint: "退出码 0 表示 passed，否则 failed；保留 stdout 字符串。",
    starter: "def parse_test_result(exitcode, stdout):\n    raise NotImplementedError",
    tests: [
      ["测试通过", "assert parse_test_result(0,'3 passed')=={'status':'passed','output':'3 passed'}"],
      ["测试失败", "assert parse_test_result(1,'1 failed')['status']=='failed'"],
      ["空输出", "assert parse_test_result(137,'')['output']==''"]
    ]
  },
  {
    day: 28, task: "计算质量门禁分数", signature: "quality_score(passed, total)",
    hint: "返回百分数（0 到 100）；当 total 为 0 时返回 0；无效数值抛 ValueError。",
    starter: "def quality_score(passed, total):\n    raise NotImplementedError",
    tests: [
      ["全部通过", "assert quality_score(5,5)==100"],
      ["半数通过", "assert quality_score(2,4)==50"],
      ["空数据", "assert quality_score(0,0)==0"],
      ["无效输入", "try:\n    quality_score(5,3)\n    assert False\nexcept ValueError: pass"]
    ]
  },
  {
    day: 29, task: "提取项目 README 的标题", signature: "readme_sections(text)",
    hint: "按行提取以 # 开头的 Markdown 标题，返回去掉 # 和空格的文字列表。",
    starter: "def readme_sections(text):\n    raise NotImplementedError",
    tests: [
      ["提取多级标题", "assert readme_sections('# Hi\\ntext\\n## Setup\\n### Test') == ['Hi','Setup','Test']"],
      ["空文档", "assert readme_sections('')==[]"],
      ["忽略正文", "assert readme_sections('hello\\nworld')==[]"]
    ]
  },
  {
    day: 30, task: "终极任务：生成测试评估报告", signature: "evaluate_results(results)",
    hint: "results 是布尔值列表；返回 passed、total、score 三项，分数百分比，空列表分数为 0。",
    starter: "def evaluate_results(results):\n    raise NotImplementedError",
    tests: [
      ["全部成功", "assert evaluate_results([True,True])=={'passed':2,'total':2,'score':100}"],
      ["部分成功", "assert evaluate_results([True,False,True,False])=={'passed':2,'total':4,'score':50}"],
      ["空测试", "assert evaluate_results([])=={'passed':0,'total':0,'score':0}"],
      ["全部失败", "assert evaluate_results([False,False])['score']==0"]
    ]
  }
];
