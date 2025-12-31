from tree_sitter_language_pack import get_parser
from models.parser_model import File, Controller, Service

HTTP_METHODS = {"get", "post", "put", "delete", "patch"}

def parse_tree_sitter(code, language, file_path):

    functions = []
    classes = []
    imports = []

    controller_routes = []
    controller_functions = []
    service_functions = []
    service_classes = []

    parser = get_parser(language)
    tree = parser.parse(code.encode())

    def walk(node):

        if node.type in ("function_declaration", "method_declaration"):

            fn_text = node.text.decode()
            fn_name = fn_text.split("(")[0].split()[-1]

            functions.append(fn_name)
            is_controller = False

            for child in node.children:
                # decorator / annotation detection
                if child.type in ("annotation", "decorator"):
                    deco_text = child.text.decode().lower()

                    for m in HTTP_METHODS:
                        if m in deco_text:
                            is_controller = True
                            controller_routes.append({
                                "function": fn_name,
                                "method": m.upper()
                            })

            if is_controller:
                controller_functions.append(fn_name)
            else:
                service_functions.append(fn_name)

        if node.type == "class_declaration":

            cls_text = node.text.decode()
            cls_name = cls_text.split("{")[0].split()[-1]

            classes.append(cls_name)

            if "service" in cls_name.lower():
                service_classes.append(cls_name)

        if node.type in ("import_statement", "import_declaration"):
            imports.append(node.text.decode())

        # Walk children
        for c in node.children:
            walk(c)

    walk(tree.root_node)
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
        language=language,
        functions=functions,
        classes=classes,
        imports=imports,
        controller=controller_obj,
        service=service_obj
    )

    return file_obj
