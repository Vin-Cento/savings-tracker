from datetime import date
import logging

today = date.today()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[
        logging.StreamHandler(),                 # console
        logging.FileHandler(
            f"{today.strftime("%d-%m-%Y")}.log"),          # file
    ],
)
