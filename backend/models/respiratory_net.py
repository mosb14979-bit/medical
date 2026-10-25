"""
backend/models/respiratory_net.py
PyTorch 2D Convolutional Neural Network for ICBHI 2017 auscultation sound classification.
Evaluates log-Mel spectrogram acoustic representations into 5 breathing sound categories.
"""

try:
    import torch
    import torch.nn as nn
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

RESP_CLASSES = ["normal", "wheeze", "crackle", "wheeze_crackle", "stridor"]

if TORCH_AVAILABLE:
    class RespiratorySpectrogramCNN(nn.Module):
        """
        2D Spectrogram Convolutional Network for respiratory cycle classification.
        Accepts 1-channel log-Mel spectrogram tensor (B, 1, 128, 128).
        """
        def __init__(self, num_classes: int = 5):
            super().__init__()
            self.conv_blocks = nn.Sequential(
                # Block 1
                nn.Conv2d(1, 32, kernel_size=3, padding=1),
                nn.BatchNorm2d(32),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2),

                # Block 2
                nn.Conv2d(32, 64, kernel_size=3, padding=1),
                nn.BatchNorm2d(64),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2),

                # Block 3
                nn.Conv2d(64, 128, kernel_size=3, padding=1),
                nn.BatchNorm2d(128),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2),

                # Global Pooling
                nn.AdaptiveAvgPool2d((1, 1))
            )
            self.fc = nn.Sequential(
                nn.Dropout(0.3),
                nn.Linear(128, 64),
                nn.ReLU(inplace=True),
                nn.Linear(64, num_classes)
            )

        def forward(self, x):
            x = self.conv_blocks(x)
            x = torch.flatten(x, 1)
            x = self.fc(x)
            return x
else:
    class RespiratorySpectrogramCNN:
        def __init__(self, *args, **kwargs):
            pass
