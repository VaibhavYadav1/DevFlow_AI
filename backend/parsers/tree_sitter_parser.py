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

        # Function / Method types
        if node.type in ("function_declaration", "method_declaration", "function_definition"):

            fn_text = node.text.decode()
            fn_name = fn_text.split("(")[0].split()[-1]

            functions.append(fn_name)
            is_controller = False

            for child in node.children:
                # decorator / annotation detection
                if child.type in ("annotation", "decorator", "metadata"):
                    deco_text = child.text.decode().lower()

                    for m in HTTP_METHODS:
                        if m in deco_text:
                            is_controller = True
                            controller_routes.append({
                                "function": fn_name,
                                "method": m.upper()
                            })
            
            # Dart/Flutter Logic: Check class context or naming if inside class
            # (Simplified logic since 'walk' is recursive but doesn't pass parent context easily here without modification)
            
            if is_controller:
                controller_functions.append(fn_name)
            else:
                service_functions.append(fn_name)

        # Class types (class_declaration is common, class_definition for some grammars)
        if node.type in ("class_declaration", "class_definition"):

            cls_text = node.text.decode()
            
            # Simple split might fail on complex headers, but works for general case
            # Dart: class MyClass ...
            parts = cls_text.split("{")[0].split()
            # Find the word after 'class'
            try:
                class_idx = parts.index("class")
                cls_name = parts[class_idx + 1]
            except ValueError:
                cls_name = parts[-1] # Fallback

            classes.append(cls_name)

            # Heuristic for Dart/FWs: Naming convention
            if "service" in cls_name.lower():
                service_classes.append(cls_name)
            if "controller" in cls_name.lower() or "bloc" in cls_name.lower() or "cubit" in cls_name.lower():
                 # Treat Bloc/Cubit as controllers for architectural summary
                pass 

        if node.type in ("import_statement", "import_declaration", "import_directive", "part_directive", "export_directive", "library_directive", "library_import"):
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
