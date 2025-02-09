from flask import Flask,render_template
def RenderResponse(template_name, status_code, context=None):
    """
    Render an HTML template with the provided context and return the response.
    
    :param template_name: The name of the template file to render.
    :param status_code: The HTTP status code to return with the response.
    :param context: A dictionary of data to pass to the template.
    :return: A rendered HTML template with the provided context and status code.
    """
    context = context if context is not None else {}
    return render_template(template_name, **context), status_code