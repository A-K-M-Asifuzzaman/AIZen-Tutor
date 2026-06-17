import type { Lesson } from "../types"

export const CV_LESSONS: Lesson[] = [
  {
    id: "transfer-learning",
    title: "Transfer Learning for Computer Vision",
    category: "Computer Vision",
    content: [
      {
        heading: "What is Transfer Learning?",
        body: "Transfer learning reuses a model pretrained on a large dataset (ImageNet — 1.2M images, 1000 classes) as a starting point for a new task. The pretrained model has already learned universal visual features: edges, textures, shapes, object parts. You only need to adapt the final layers.\n\nWhy it works: early CNN layers are task-agnostic feature extractors. Only the final classification layers are task-specific.",
      },
      {
        heading: "Two Strategies",
        body: "Feature Extraction — Freeze ALL pretrained layers. Add and train only a new classification head. Best when: small dataset (<5K images), similar domain to ImageNet.\n\nFine-Tuning — Unfreeze the last few blocks and train with a small learning rate alongside the new head. Best when: medium dataset, slightly different domain.\n\nFull Fine-Tuning — Unfreeze everything. Needs large dataset or risks catastrophic forgetting of pretrained knowledge.",
      },
      {
        heading: "Choosing a Pretrained Backbone",
        body: "EfficientNet-B0 to B7 — Excellent accuracy/speed tradeoff. Good default.\nResNet-50/101 — Reliable, widely studied, easy to fine-tune.\nConvNeXt-Base — Modern CNN matching ViT performance, better than ResNet.\nViT-B/16 — Vision Transformer, best accuracy when pretrained on large data.\nMobileNetV3 — Optimized for edge/mobile deployment.\nDINO/SAM — Self-supervised, excellent features without task-specific pretraining.",
      },
      {
        heading: "Transfer Learning Pipeline",
        body: "Full EfficientNet fine-tuning pipeline with two-stage training.",
        code: `import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as T
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder

# ─── Data augmentation ───────────────────────────────────────
train_transforms = T.Compose([
    T.RandomResizedCrop(224),
    T.RandomHorizontalFlip(),
    T.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    T.RandomRotation(15),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406],  # ImageNet stats
                std=[0.229, 0.224, 0.225])
])

val_transforms = T.Compose([
    T.Resize(256),
    T.CenterCrop(224),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# train_ds = ImageFolder("data/train", transform=train_transforms)
# val_ds   = ImageFolder("data/val",   transform=val_transforms)

# ─── Model: EfficientNet with custom head ────────────────────
NUM_CLASSES = 5

model = models.efficientnet_b0(weights="IMAGENET1K_V1")

# Stage 1: Freeze backbone, train only head
for param in model.parameters():
    param.requires_grad = False

# Replace classifier
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(in_features, NUM_CLASSES)
)

# Stage 1 optimizer (head only)
optimizer = torch.optim.Adam(model.classifier.parameters(), lr=1e-3)

# ─── Training function ───────────────────────────────────────
def train_epoch(model, loader, optimizer, criterion, device):
    model.train()
    total_loss, correct, total = 0, 0, 0
    for imgs, labels in loader:
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        out  = model(imgs)
        loss = criterion(out, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
        correct    += (out.argmax(1) == labels).sum().item()
        total      += labels.size(0)
    return total_loss / len(loader), correct / total

# Stage 2: Unfreeze last 2 blocks for fine-tuning
for name, param in model.named_parameters():
    if "features.7" in name or "features.8" in name:
        param.requires_grad = True

# Fine-tune with very small LR for pretrained layers
optimizer_ft = torch.optim.Adam([
    {"params": model.classifier.parameters(), "lr": 1e-3},
    {"params": [p for n,p in model.named_parameters()
                if ("features.7" in n or "features.8" in n)], "lr": 1e-5},
])`,
        note: "Always normalize with ImageNet mean/std when using ImageNet-pretrained weights. Different normalization = garbage features.",
      },
    ],
  },
  {
    id: "object-detection",
    title: "Object Detection — YOLO & Faster R-CNN",
    category: "Computer Vision",
    content: [
      {
        heading: "What is Object Detection?",
        body: "Object detection simultaneously answers two questions:\n1. What objects are in the image? (classification)\n2. Where are they? (bounding box regression)\n\nOutput: a set of (class, confidence, x, y, width, height) tuples.\n\nTwo major paradigms:\n• Two-stage (Faster R-CNN): propose regions → classify. High accuracy, slower.\n• One-stage (YOLO, SSD): predict directly from full image. Faster, slightly less accurate.",
      },
      {
        heading: "YOLO — You Only Look Once",
        body: "YOLO divides the image into an S×S grid. Each cell predicts B bounding boxes with confidence scores and C class probabilities.\n\nYOLO versions:\nYOLOv5 — PyTorch, easy to use, great community.\nYOLOv8 — Ultralytics, state-of-the-art, supports detection/segmentation/pose/classification.\nYOLO-NAS — Neural Architecture Search optimized YOLO, best accuracy/speed tradeoff.\nRT-DETR — Transformer-based detector, no NMS needed.",
      },
      {
        heading: "Faster R-CNN",
        body: "Three components:\n1. Backbone CNN (ResNet) — extracts feature maps\n2. Region Proposal Network (RPN) — proposes candidate object regions\n3. ROI Pooling + Classifier Head — classifies and refines each proposal\n\nFaster R-CNN is used when accuracy is critical (medical imaging, autonomous driving) and speed is secondary.",
      },
      {
        heading: "YOLOv8 Training & Inference",
        body: "Complete YOLOv8 workflow from pretrained inference to custom dataset training.",
        code: `# Install: pip install ultralytics

from ultralytics import YOLO
import cv2

# ─── Inference with pretrained YOLO ──────────────────────────
model = YOLO("yolov8n.pt")   # nano: fastest. Also: s, m, l, x (larger = more accurate)

# Run inference on image
results = model("https://ultralytics.com/images/bus.jpg")
for r in results:
    print(f"Detected {len(r.boxes)} objects")
    for box in r.boxes:
        cls   = int(box.cls[0])
        conf  = float(box.conf[0])
        xyxy  = box.xyxy[0].tolist()
        label = model.names[cls]
        print(f"  {label}: {conf:.2f} at {[round(v) for v in xyxy]}")

# ─── Custom dataset training ──────────────────────────────────
# Dataset structure:
# data/
#   images/train/*.jpg
#   images/val/*.jpg
#   labels/train/*.txt  (YOLO format: class cx cy w h, normalized 0-1)
#   labels/val/*.txt
#   dataset.yaml

# dataset.yaml content:
# path: ./data
# train: images/train
# val: images/val
# nc: 3  # number of classes
# names: ['cat', 'dog', 'bird']

model = YOLO("yolov8s.pt")  # Start from pretrained small model
results = model.train(
    data="dataset.yaml",
    epochs=100,
    imgsz=640,
    batch=16,
    lr0=0.01,
    lrf=0.01,            # Final LR = lr0 * lrf
    momentum=0.937,
    weight_decay=0.0005,
    augment=True,        # Built-in augmentation (mosaic, mixup, flips)
    patience=20,         # Early stopping
    device=0,            # GPU 0
    project="runs",
    name="my_detector"
)

# Evaluate
metrics = model.val()
print(f"mAP50: {metrics.box.map50:.3f}")
print(f"mAP50-95: {metrics.box.map:.3f}")

# Export to ONNX for deployment
model.export(format="onnx", optimize=True)`,
        note: "mAP50-95 is the standard COCO metric — mean Average Precision at IoU thresholds from 0.50 to 0.95 in 0.05 steps.",
      },
    ],
  },
  {
    id: "image-segmentation",
    title: "Image Segmentation",
    category: "Computer Vision",
    content: [
      {
        heading: "Types of Segmentation",
        body: "Semantic Segmentation — Assigns a class label to every pixel. Does not distinguish individual instances. Example: all cars are labeled 'car' regardless of how many there are.\n\nInstance Segmentation — Detects individual object instances AND segments them. Each car gets a separate mask with a unique ID.\n\nPanoptic Segmentation — Combines semantic (background 'stuff') and instance (foreground 'things') segmentation into one unified output.",
      },
      {
        heading: "U-Net Architecture",
        body: "U-Net is the dominant architecture for semantic segmentation, especially in medical imaging.\n\nEncoder (contracting path): standard CNN backbone, progressively downsamples to capture context.\nDecoder (expanding path): progressively upsamples back to original resolution.\nSkip connections: concatenate encoder feature maps to corresponding decoder layers — preserves fine spatial details.\n\nThe 'U' shape gives the architecture its name.",
      },
      {
        heading: "Segment Anything Model (SAM)",
        body: "Meta's SAM (2023) is a foundation model for segmentation. Given any prompt (point, box, text, mask), it segments the corresponding object. Zero-shot — no fine-tuning needed for new objects.\n\nSAM 2 (2024) extends this to video segmentation in real-time.",
      },
      {
        heading: "U-Net Implementation",
        body: "Full U-Net with skip connections in PyTorch, ready for semantic segmentation tasks.",
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class DoubleConv(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True)
        )
    def forward(self, x): return self.net(x)

class UNet(nn.Module):
    def __init__(self, in_channels=3, num_classes=2, features=[64, 128, 256, 512]):
        super().__init__()
        self.downs, self.ups = nn.ModuleList(), nn.ModuleList()
        self.pool = nn.MaxPool2d(2, 2)

        # Encoder
        ch = in_channels
        for f in features:
            self.downs.append(DoubleConv(ch, f))
            ch = f

        # Bottleneck
        self.bottleneck = DoubleConv(features[-1], features[-1] * 2)

        # Decoder
        for f in reversed(features):
            self.ups.append(nn.ConvTranspose2d(f * 2, f, 2, 2))
            self.ups.append(DoubleConv(f * 2, f))

        self.final = nn.Conv2d(features[0], num_classes, 1)

    def forward(self, x):
        skip_connections = []
        for down in self.downs:
            x = down(x)
            skip_connections.append(x)
            x = self.pool(x)

        x = self.bottleneck(x)
        skip_connections.reverse()

        for i in range(0, len(self.ups), 2):
            x = self.ups[i](x)           # Upsample
            skip = skip_connections[i//2]
            if x.shape != skip.shape:
                x = F.interpolate(x, size=skip.shape[2:])
            x = torch.cat([skip, x], dim=1)  # Skip connection
            x = self.ups[i+1](x)         # Double conv

        return self.final(x)

model = UNet(in_channels=3, num_classes=21)  # 21 = PASCAL VOC classes
x = torch.randn(2, 3, 256, 256)
out = model(x)
print(f"Output shape: {out.shape}")   # (2, 21, 256, 256)

# Loss for segmentation: CrossEntropy per pixel
criterion = nn.CrossEntropyLoss()
targets = torch.randint(0, 21, (2, 256, 256))
loss = criterion(out, targets)
print(f"Loss: {loss.item():.4f}")`,
        note: "For medical imaging: use Dice Loss or a combination of Dice + CrossEntropy. Dice Loss handles class imbalance better.",
      },
    ],
  },
  {
    id: "vision-transformers",
    title: "Vision Transformers (ViT)",
    category: "Computer Vision",
    content: [
      {
        heading: "ViT — Vision Transformer",
        body: "ViT (Dosovitskiy et al., 2020) applies the Transformer architecture directly to image patches, without any convolutional layers.\n\nKey idea: split the image into 16×16 patches → flatten each patch → project to d_model dimensions → apply standard Transformer encoder.\n\nA 224×224 image with 16×16 patches gives (224/16)² = 196 patch tokens + 1 [CLS] token = 197 total tokens.",
      },
      {
        heading: "ViT vs CNN",
        body: "CNNs:\n+ Strong inductive biases (locality, translation invariance) — good with less data\n+ Computationally efficient (shared local filters)\n− Limited global context (fixed receptive field)\n\nViT:\n+ Global self-attention from the first layer — sees full image context\n+ Scales better with data and compute\n− Needs large datasets or heavy augmentation (no inductive bias)\n− Quadratic attention cost O(n²) — expensive for high-resolution",
      },
      {
        heading: "Improvements Over ViT",
        body: "DeiT — Data-efficient ViT via knowledge distillation from CNN teacher. Trains well on ImageNet alone.\nSwin Transformer — Hierarchical ViT with shifted window attention. O(n) cost. State-of-the-art on detection/segmentation.\nMAE (Masked Autoencoder) — Self-supervised ViT pretraining by masking 75% of patches and reconstructing. Learns rich representations.\nDINO / DINOv2 — Self-supervised ViT features. Excellent zero-shot performance.",
      },
      {
        heading: "ViT from Scratch",
        body: "ViT-Base/16 implementation with patch embedding, positional encoding, and Transformer encoder.",
        code: `import torch
import torch.nn as nn

class PatchEmbedding(nn.Module):
    def __init__(self, img_size=224, patch_size=16, in_channels=3, d_model=768):
        super().__init__()
        self.n_patches = (img_size // patch_size) ** 2
        # Conv2d as efficient patch projection
        self.proj = nn.Conv2d(in_channels, d_model, kernel_size=patch_size, stride=patch_size)

    def forward(self, x):
        x = self.proj(x)                    # (B, d_model, H/P, W/P)
        x = x.flatten(2).transpose(1, 2)    # (B, n_patches, d_model)
        return x

class ViT(nn.Module):
    def __init__(self, img_size=224, patch_size=16, in_channels=3,
                 d_model=768, n_heads=12, n_layers=12, n_classes=1000, dropout=0.1):
        super().__init__()
        self.patch_embed = PatchEmbedding(img_size, patch_size, in_channels, d_model)
        n_patches = (img_size // patch_size) ** 2

        self.cls_token  = nn.Parameter(torch.zeros(1, 1, d_model))
        self.pos_embed  = nn.Parameter(torch.randn(1, n_patches + 1, d_model) * 0.02)
        self.dropout    = nn.Dropout(dropout)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model, n_heads, dim_feedforward=d_model*4,
            dropout=dropout, activation="gelu",
            batch_first=True, norm_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, n_layers)
        self.norm = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, n_classes)
        self._init_weights()

    def _init_weights(self):
        nn.init.trunc_normal_(self.pos_embed, std=0.02)
        nn.init.trunc_normal_(self.cls_token, std=0.02)

    def forward(self, x):
        B = x.size(0)
        x = self.patch_embed(x)                             # (B, n_patches, d_model)
        cls = self.cls_token.expand(B, -1, -1)              # (B, 1, d_model)
        x   = torch.cat([cls, x], dim=1)                    # (B, n_patches+1, d_model)
        x   = self.dropout(x + self.pos_embed)
        x   = self.transformer(x)
        x   = self.norm(x[:, 0])                            # CLS token only
        return self.head(x)

# ViT-Base/16 configuration
vit = ViT(img_size=224, patch_size=16, d_model=768, n_heads=12, n_layers=12, n_classes=1000)
x = torch.randn(2, 3, 224, 224)
print(f"Output: {vit(x).shape}")   # (2, 1000)
print(f"Params: {sum(p.numel() for p in vit.parameters()):,}")`,
        note: "For production, always use pretrained ViT from timm library — training ViT from scratch requires massive compute and data.",
      },
    ],
  },
  {
    id: "data-augmentation",
    title: "Data Augmentation",
    category: "Computer Vision",
    content: [
      {
        heading: "Why Augmentation?",
        body: "Data augmentation artificially expands the training dataset by applying random transformations that preserve the label. It's the most cost-effective regularization technique for computer vision — often gives 2–5% accuracy improvement for free.",
      },
      {
        heading: "Basic Augmentations",
        body: "Geometric: RandomHorizontalFlip, RandomRotation, RandomCrop, RandomResizedCrop, RandomAffine, ElasticTransform.\n\nColor/Photometric: ColorJitter (brightness/contrast/saturation/hue), GaussianBlur, RandomGrayscale, RandomSolarize.\n\nErasing: RandomErasing, Cutout — randomly masks regions, forces learning from partial views.",
      },
      {
        heading: "Advanced Augmentations",
        body: "Mixup: blends two images and their labels linearly: x̃ = λx_i + (1-λ)x_j, ỹ = λy_i + (1-λ)y_j.\n\nCutMix: pastes a random crop from one image into another, mixes labels proportionally by area.\n\nRandAugment: applies N random operations from a fixed set, each at magnitude M. Removes the need for manual augmentation tuning.\n\nTrivialAugment: even simpler — one random op at a random strength. Matches RandAugment performance.",
      },
      {
        heading: "Augmentation Pipeline with torchvision & Albumentations",
        body: "torchvision v2 for classification, Albumentations for segmentation tasks with synchronized mask transforms.",
        code: `import torch
import torchvision.transforms.v2 as T
import albumentations as A
from albumentations.pytorch import ToTensorV2
import numpy as np

# ─── torchvision v2 (modern, supports all data types) ────────
train_transform = T.Compose([
    T.RandomResizedCrop(224, scale=(0.08, 1.0)),
    T.RandomHorizontalFlip(p=0.5),
    T.RandomVerticalFlip(p=0.1),
    T.ColorJitter(brightness=0.4, contrast=0.4, saturation=0.4, hue=0.1),
    T.RandomGrayscale(p=0.2),
    T.GaussianBlur(kernel_size=23, sigma=(0.1, 2.0)),
    T.RandomErasing(p=0.25, scale=(0.02, 0.33)),
    T.ToImage(),
    T.ToDtype(torch.float32, scale=True),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Mixup + CutMix (built-in with torchvision v2)
mixup   = T.MixUp(alpha=0.2, num_classes=100)
cutmix  = T.CutMix(alpha=1.0, num_classes=100)
augmix_fn = T.RandomChoice([mixup, cutmix])

# Apply to batch
imgs   = torch.rand(8, 3, 224, 224)
labels = torch.randint(0, 100, (8,))
imgs_aug, labels_aug = augmix_fn(imgs, labels)
print(f"Mixup/CutMix labels (soft): {labels_aug[0]}")

# ─── Albumentations (best for medical/segmentation tasks) ────
alb_transform = A.Compose([
    A.RandomResizedCrop(224, 224, scale=(0.5, 1.0)),
    A.HorizontalFlip(p=0.5),
    A.ShiftScaleRotate(shift_limit=0.1, scale_limit=0.2, rotate_limit=30, p=0.5),
    A.OneOf([
        A.ElasticTransform(alpha=120, sigma=6, alpha_affine=3.6, p=0.5),
        A.GridDistortion(p=0.5),
        A.OpticalDistortion(p=0.5),
    ], p=0.3),
    A.CLAHE(clip_limit=4, p=0.3),
    A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
    ToTensorV2()
], additional_targets={"mask": "mask"})   # Applies same spatial transforms to mask!

# Usage
image = np.random.randint(0, 255, (512, 512, 3), dtype=np.uint8)
mask  = np.random.randint(0, 2, (512, 512), dtype=np.uint8)
result = alb_transform(image=image, mask=mask)
print(f"Aug image: {result['image'].shape}, mask: {result['mask'].shape}")`,
        note: "Use Albumentations for segmentation tasks — it automatically applies identical spatial transforms to both image and mask. torchvision v2 is great for classification.",
      },
    ],
  },
  {
    id: "model-evaluation-cv",
    title: "Evaluation Metrics for Computer Vision",
    category: "Computer Vision",
    content: [
      {
        heading: "Classification Metrics",
        body: "Top-1 Accuracy — Fraction where the highest-probability prediction is correct.\nTop-5 Accuracy — Fraction where the correct class is in the top 5 predictions. Standard on ImageNet.\nConfusion Matrix — N×N matrix showing class-by-class predictions. Reveals systematic confusion between similar classes.",
      },
      {
        heading: "Detection Metrics — mAP",
        body: "IoU (Intersection over Union) — measures overlap between predicted and ground truth box:\n\nIoU = Area(pred ∩ gt) / Area(pred ∪ gt)\n\nA prediction is a True Positive if IoU ≥ threshold (usually 0.5).\n\nAP (Average Precision) — area under the Precision-Recall curve for one class.\nmAP — mean AP across all classes. Standard: mAP@0.5 and mAP@0.5:0.95 (COCO).",
      },
      {
        heading: "Segmentation Metrics",
        body: "Pixel Accuracy — fraction of correctly classified pixels. Misleading with class imbalance.\n\nmIoU (mean Intersection over Union) — standard metric. Compute IoU per class, average across classes:\n\nIoU_class = TP / (TP + FP + FN)\nmIoU = mean(IoU_class for all classes)\n\nDice Score — 2·TP / (2·TP + FP + FN). Equivalent to F1. Preferred in medical imaging.",
      },
      {
        heading: "Computing CV Metrics",
        body: "mAP for detection with torchmetrics, mIoU and Dice score for segmentation.",
        code: `import torch
import numpy as np
from torchmetrics.detection import MeanAveragePrecision
from torchmetrics.segmentation import MeanIoU

# ─── Detection: mAP with torchmetrics ────────────────────────
metric = MeanAveragePrecision(iou_type="bbox")

# Format: list of dicts, one per image
preds = [{
    "boxes":  torch.tensor([[10, 20, 100, 200], [50, 60, 150, 250]], dtype=torch.float32),
    "scores": torch.tensor([0.9, 0.75]),
    "labels": torch.tensor([0, 1])
}]
targets = [{
    "boxes":  torch.tensor([[12, 18, 98, 202], [55, 65, 145, 255]], dtype=torch.float32),
    "labels": torch.tensor([0, 1])
}]

metric.update(preds, targets)
results = metric.compute()
print(f"mAP@0.5:      {results['map_50']:.3f}")
print(f"mAP@0.5:0.95: {results['map']:.3f}")

# ─── Segmentation: mIoU ──────────────────────────────────────
def compute_miou(pred_masks, true_masks, num_classes):
    """pred_masks, true_masks: (B, H, W) int tensors"""
    ious = []
    for cls in range(num_classes):
        pred_cls = (pred_masks == cls)
        true_cls = (true_masks == cls)
        intersection = (pred_cls & true_cls).sum().float()
        union        = (pred_cls | true_cls).sum().float()
        if union == 0: continue
        ious.append((intersection / union).item())
    return np.mean(ious)

pred  = torch.randint(0, 21, (4, 256, 256))
label = torch.randint(0, 21, (4, 256, 256))
miou  = compute_miou(pred, label, num_classes=21)
print(f"mIoU: {miou:.3f}")

# Dice Score for binary segmentation (medical)
def dice_score(pred, target, smooth=1e-6):
    pred   = (torch.sigmoid(pred) > 0.5).float()
    inter  = (pred * target).sum()
    return (2 * inter + smooth) / (pred.sum() + target.sum() + smooth)`,
        note: "Never report only pixel accuracy for segmentation — a model predicting all background on a mostly-background dataset gets 95%+ accuracy without detecting anything.",
      },
    ],
  },
]
