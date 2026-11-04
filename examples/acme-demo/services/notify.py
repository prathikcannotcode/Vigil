import logging
logger = logging.getLogger(__name__)

def send_sms(phone, body):
    logger.info("sending sms to %s: %s", phone, body)
    return gateway_send(phone, body)
