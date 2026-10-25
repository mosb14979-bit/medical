"""
backend/models/skin_net.py
PyTorch Deep Convolutional Neural Network for HAM10000 7-class skin lesion classification.
"""

try:
    import torch
    import torch.nn as nn
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

SKIN_CLASSES = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]

if TORCH_AVAILABLE:
    class SkinLesionCNN(nn.Module):
        """
        Lightweight custom convolutional architecture for dermatoscopic classification.
        Features 4 convolutional blocks with batch normalization, max pooling, and dropout.
        """
        def __init__(self, num_classes: int = 7):
            super().__init__()
            self.features = nn.Sequential(
                # Block 1
                nn.Conv2d(3, 32, kernel_size=3, padding=1),
                nn.BatchNorm2d(32),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2), # 112x112

                # Block 2
                nn.Conv2d(32, 64, kernel_size=3, padding=1),
                nn.BatchNorm2d(64),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2), # 56x56

                # Block 3
                nn.Conv2d(64, 128, kernel_size=3, padding=1),
                nn.BatchNorm2d(128),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2), # 28x28

                # Block 4
                nn.Conv2d(128, 256, kernel_size=3, padding=1),
                nn.BatchNorm2d(256),
                nn.ReLU(inplace=True),
                nn.AdaptiveAvgPool2d((1, 1)) # 1x1
            )
            self.classifier = nn.Sequential(
                nn.Dropout(0.4),
                nn.Linear(256, 128),
                nn.ReLU(inplace=True),
                nn.Dropout(0.2),
                nn.Linear(128, num_classes)
            )

        def forward(self, x):
            x = self.features(x)
            x = torch.flatten(x, 1)
            x = self.classifier(x)
            return x
else:
    class SkinLesionCNN:
        def __init__(self, *args, **kwargs):
            pass
