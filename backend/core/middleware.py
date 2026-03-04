import logging

logger = logging.getLogger(__name__)

class DebugUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            print(f"--- Request: {request.method} {request.path} | User: {request.user.email} ---")
        else:
            print(f"--- Request: {request.method} {request.path} | User: Anonymous ---")
        
        response = self.get_response(request)
        return response
