import sys, json

code = sys.stdin.read()
logs = []

try:
    local_vars = {}
    exec(code, {}, local_vars)
    result = local_vars.get("result", None)
    print(json.dumps({"result": result, "logs": logs, "error": None}))
except Exception as e:
    print(json.dumps({"result": None, "logs": logs, "error": str(e)}))