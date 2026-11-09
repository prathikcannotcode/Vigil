import logging

logger = logging.getLogger("kadamba.api.middleware")


class RequestLogMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, request):
        logger.debug("%s %s headers=%s body=%s", request.method, request.path, dict(request.headers), request.body)
        response = self.app(request)
        logger.info("%s %s %s", request.method, request.path, response.status)
        return response
