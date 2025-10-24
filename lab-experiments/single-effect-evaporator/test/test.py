import numpy as np
import matplotlib.pyplot as plt
from collections import deque

MAX_LEN = 1000
CALLS_PER_SEC = 60

if __name__ == "__main__":
    residuals = deque(maxlen=MAX_LEN)
    times = deque(maxlen=MAX_LEN)

    