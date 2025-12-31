import ast
from models.parser_model import File, Controller, Service

HTTP_METHODS = {"get", "post", "put", "delete", "patch"}

def parse_python(code: str, file_path: str):

    functions = []
    classes = []
    imports = []

    controller_routes = []
    controller_functions = []
    service_functions = []
    service_classes = []
    
    tree = ast.parse(code)

    for node in ast.walk(tree):

        if isinstance(node, ast.FunctionDef):
            functions.append(node.name)

            is_controller = False

            for deco in node.decorator_list:
                if isinstance(deco, ast.Call) and isinstance(deco.func, ast.Attribute):
                    if deco.func.attr in HTTP_METHODS:
                        is_controller = True
                        controller_routes.append({
                            "function": node.name,
                            "method": deco.func.attr.upper()
                        })

            if is_controller:
                controller_functions.append(node.name)
            else:
                # business logic → service function
                service_functions.append(node.name)

        if isinstance(node, ast.ClassDef):
            classes.append(node.name)

            # heuristic: service class
            if "service" in node.name.lower():
                service_classes.append(node.name)

        if isinstance(node, ast.Import):
            for n in node.names:
                imports.append(n.name)

        if isinstance(node, ast.ImportFrom) and node.module:
            imports.append(node.module)

    controller_obj = Controller(
        routes=controller_routes,
        functions=controller_functions
    )

    service_obj = Service(
        classes=service_classes,
        functions=service_functions
    )

    file_obj = File(
        file_path=file_path,
        language="python",
        functions=functions,
        classes=classes,
        imports=imports,
        controller=controller_obj,
        service=service_obj
    )

    return file_obj
