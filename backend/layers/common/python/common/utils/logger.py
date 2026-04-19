import logging


def setup_logger(service_name):
    logger = logging.getLogger(service_name)

    if not logger.handlers:
        logger.setLevel(logging.INFO)

    return logger
