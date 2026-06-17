import type { Lesson } from "../types"

export const DL_LESSONS: Lesson[] = [
  {
    id: "neural-networks",
    title: "Neural Networks Fundamentals",
    category: "Deep Learning",
    content: [
      {
        heading: "What is a Neural Network?",
        body: "A Neural Network is a universal function approximator built from layers of interconnected neurons. Each neuron computes:\n\noutput = activation(W · x + b)\n\nWhere W is a weight matrix, x is the input, b is a bias, and activation is a non-linear function. Stacking many layers allows the network to learn arbitrarily complex mappings from input to output.",
      },
      {
        heading: "Architecture Components",
        body: "Input Layer — Receives raw features. One neuron per feature.\nHidden Layers — Extract progressively abstract representations. More layers = deeper network = more expressive.\nOutput Layer — Produces predictions. Shape depends on task:\n  • Binary classification: 1 neuron + Sigmoid\n  • Multi-class: N neurons + Softmax\n  • Regression: 1 neuron + no activation (linear)",
      },
      {
        heading: "Why Activation Functions?",
        body: "Without activation functions, stacking layers is equivalent to a single linear transformation. Non-linearities allow the network to learn curves, boundaries, and complex patterns.\n\nReLU: f(x) = max(0, x) — default for hidden layers. Fast, no vanishing gradient for positive values.\nLeaky ReLU: f(x) = max(0.01x, x) — avoids dead neurons.\nSigmoid: f(x) = 1/(1+e^−x) — used in output for binary classification.\nSoftmax: normalizes outputs to probability distribution for multi-class.\nGELU: Gaussian Error Linear Unit — used in Transformers (BERT, GPT).",
      },
      {
        heading: "Neural Network in PyTorch",
        code: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# Build a 3-layer classifier
class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, dropout=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.BatchNorm1d(hidden_dim // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim // 2, output_dim)
        )

    def forward(self, x):
        return self.net(x)

# Training loop
def train(model, loader, optimizer, criterion, epochs=10):
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for X_batch, y_batch in loader:
            optimizer.zero_grad()
            logits = model(X_batch)
            loss = criterion(logits, y_batch)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}: loss={total_loss/len(loader):.4f}")

model = MLP(input_dim=20, hidden_dim=128, output_dim=2)
optimizer = optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)
criterion = nn.CrossEntropyLoss()`,
        note: "weight_decay in Adam is L2 regularization. BatchNorm1d + Dropout together stabilize training and reduce overfitting.",
      },
    ],
  },
  {
    id: "backpropagation",
    title: "Backpropagation",
    category: "Deep Learning",
    content: [
      {
        heading: "What is Backpropagation?",
        body: "Backpropagation is the algorithm that computes gradients of the loss with respect to every weight in a neural network using the chain rule of calculus. It enables gradient descent to update all weights efficiently in a single backward pass.",
      },
      {
        heading: "Forward Pass",
        body: "Input flows through the network layer by layer:\nx → z₁ = W₁x + b₁ → a₁ = relu(z₁) → z₂ = W₂a₁ + b₂ → ŷ = sigmoid(z₂) → L = loss(ŷ, y)\n\nAll intermediate values (z₁, a₁, z₂) are cached — needed for the backward pass.",
      },
      {
        heading: "Backward Pass — Chain Rule",
        body: "Starting from the loss, propagate gradients backward:\n\n∂L/∂W₂ = ∂L/∂ŷ · ∂ŷ/∂z₂ · ∂z₂/∂W₂\n∂L/∂a₁ = ∂L/∂ŷ · ∂ŷ/∂z₂ · ∂z₂/∂a₁\n∂L/∂W₁ = ∂L/∂a₁ · ∂a₁/∂z₁ · ∂z₁/∂W₁\n\nEach weight gets its exact gradient. Then update: W ← W − α·∂L/∂W",
      },
      {
        heading: "Manual Backprop (2-layer network)",
        code: `import numpy as np

def sigmoid(z): return 1 / (1 + np.exp(-z))
def relu(z): return np.maximum(0, z)
def relu_grad(z): return (z > 0).astype(float)

# Forward pass
np.random.seed(42)
X = np.random.randn(5, 3)   # 5 samples, 3 features
y = np.array([1, 0, 1, 0, 1]).reshape(-1, 1)

W1 = np.random.randn(3, 4) * 0.1
b1 = np.zeros((1, 4))
W2 = np.random.randn(4, 1) * 0.1
b2 = np.zeros((1, 1))
lr = 0.1

for epoch in range(500):
    # Forward
    z1 = X @ W1 + b1
    a1 = relu(z1)
    z2 = a1 @ W2 + b2
    yhat = sigmoid(z2)
    loss = -np.mean(y * np.log(yhat + 1e-8) + (1-y) * np.log(1-yhat + 1e-8))

    # Backward
    dL_dyhat = (yhat - y) / len(y)
    dL_dz2   = dL_dyhat * yhat * (1 - yhat)
    dL_dW2   = a1.T @ dL_dz2
    dL_db2   = dL_dz2.sum(axis=0, keepdims=True)
    dL_da1   = dL_dz2 @ W2.T
    dL_dz1   = dL_da1 * relu_grad(z1)
    dL_dW1   = X.T @ dL_dz1
    dL_db1   = dL_dz1.sum(axis=0, keepdims=True)

    # Update
    W1 -= lr * dL_dW1;  b1 -= lr * dL_db1
    W2 -= lr * dL_dW2;  b2 -= lr * dL_db2

    if epoch % 100 == 0:
        print(f"Epoch {epoch}: Loss={loss:.4f}")`,
        note: "PyTorch's autograd does this automatically — but understanding it from scratch is essential for debugging, designing new architectures, and interviews.",
      },
    ],
  },
  {
    id: "activation-functions",
    title: "Activation Functions",
    category: "Deep Learning",
    content: [
      {
        heading: "Why Non-linearity?",
        body: "Without activation functions, N stacked linear layers collapse to a single linear transformation. Non-linearity lets networks approximate any continuous function (Universal Approximation Theorem).",
      },
      {
        heading: "ReLU Family",
        body: "ReLU: f(x) = max(0, x)\n  + Computationally cheap, no vanishing gradient for x>0\n  − Dead neurons: if x<0 always, the neuron never activates or updates\n\nLeaky ReLU: f(x) = max(0.01x, x) — fixes dead neurons\nPReLU: learnable slope for negative values\nELU: smooth negative saturation, self-normalizing properties\nSELU: scaled ELU, enables self-normalizing networks (no BatchNorm needed)",
      },
      {
        heading: "Modern Activations",
        body: "GELU (Gaussian Error Linear Unit):\n  f(x) = x · Φ(x)  — used in BERT, GPT, ViT\n\nSwiGLU: f(x, gate) = x · sigmoid(gate) — used in LLaMA, PaLM\n\nMish: f(x) = x · tanh(softplus(x)) — smooth, outperforms ReLU on many tasks",
      },
      {
        heading: "Comparing Activations",
        code: `import torch
import torch.nn as nn
import numpy as np

x = torch.linspace(-3, 3, 100)

activations = {
    "ReLU":       nn.ReLU(),
    "LeakyReLU":  nn.LeakyReLU(0.1),
    "ELU":        nn.ELU(alpha=1.0),
    "GELU":       nn.GELU(),
    "Sigmoid":    nn.Sigmoid(),
    "Tanh":       nn.Tanh(),
    "Softplus":   nn.Softplus(),
}

for name, fn in activations.items():
    y = fn(x)
    # Range and behavior
    print(f"{name:12s}: min={y.min():.2f}, max={y.max():.2f}, "
          f"at x=0: {fn(torch.tensor(0.0)):.3f}")

# Gradient check (vanishing gradient problem)
x_neg = torch.tensor(-5.0, requires_grad=True)
sigmoid_out = torch.sigmoid(x_neg)
sigmoid_out.backward()
print(f"\nSigmoid gradient at x=-5: {x_neg.grad:.6f}")  # Near zero!

x_neg2 = torch.tensor(-5.0, requires_grad=True)
relu_out = torch.relu(x_neg2)
relu_out.backward()
print(f"ReLU gradient at x=-5:    {x_neg2.grad:.6f}")   # Exactly 0 (dead)`,
        note: "Default choice for hidden layers: ReLU (CNNs, MLPs) or GELU (Transformers). Sigmoid only in output for binary classification.",
      },
    ],
  },
  {
    id: "optimizers",
    title: "Optimizers — SGD, Adam, AdamW",
    category: "Deep Learning",
    content: [
      {
        heading: "SGD with Momentum",
        body: "Vanilla SGD oscillates. Momentum smooths updates by accumulating a velocity:\n\nv_t = β·v_{t-1} + (1−β)·∇L\nw_t = w_{t-1} − α·v_t\n\nβ=0.9 is standard. Nesterov Momentum looks ahead before computing gradient — faster convergence.",
      },
      {
        heading: "Adam (Adaptive Moment Estimation)",
        body: "Adam maintains per-parameter adaptive learning rates:\n\nm_t = β₁·m_{t-1} + (1−β₁)·g  (1st moment — momentum)\nv_t = β₂·v_{t-1} + (1−β₂)·g²  (2nd moment — squared gradient)\nŵ_t = w_{t-1} − α·m̂_t / (√v̂_t + ε)\n\nDefaults: α=1e-3, β₁=0.9, β₂=0.999, ε=1e-8\n\nAdam handles sparse gradients, scales LR per parameter, converges fast. Default choice for most deep learning.",
      },
      {
        heading: "AdamW — Adam + Weight Decay Fixed",
        body: "Standard Adam applies weight decay incorrectly (via gradient update). AdamW decouples weight decay from gradient:\n\nw_t = (1 − α·λ)·w_{t-1} − α·m̂_t / (√v̂_t + ε)\n\nThis is the correct L2 regularization for Adam. Used in all modern Transformers (BERT, GPT, ViT). Always prefer AdamW over Adam for transformer training.",
      },
      {
        heading: "Learning Rate Schedulers",
        code: `import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Linear(10, 1)
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

# Cosine Annealing — smoothly decays LR to near zero
cos_scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)

# Warmup + Cosine (standard for Transformers)
from torch.optim.lr_scheduler import LinearLR, CosineAnnealingLR, SequentialLR
warmup = LinearLR(optimizer, start_factor=0.01, total_iters=10)
cosine = CosineAnnealingLR(optimizer, T_max=90)
scheduler = SequentialLR(optimizer, schedulers=[warmup, cosine], milestones=[10])

# OneCycleLR — fast convergence, single cycle
one_cycle = optim.lr_scheduler.OneCycleLR(
    optimizer, max_lr=1e-2, steps_per_epoch=100, epochs=10
)

# ReduceLROnPlateau — reduce when validation loss plateaus
plateau = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer, mode="min", factor=0.5, patience=5, verbose=True
)

# Training step
for epoch in range(100):
    train_loss = 0.1  # placeholder
    optimizer.step()
    scheduler.step()
    print(f"Epoch {epoch}: lr={optimizer.param_groups[0]['lr']:.6f}")`,
        note: "For Transformers: AdamW + linear warmup + cosine decay. For CNNs: SGD + momentum + cosine annealing often beats Adam.",
      },
    ],
  },
  {
    id: "batch-norm-dropout",
    title: "Batch Normalization & Dropout",
    category: "Deep Learning",
    content: [
      {
        heading: "Batch Normalization",
        body: "BatchNorm normalizes layer inputs across the batch dimension:\n\nx̂ = (x − μ_B) / √(σ²_B + ε)\ny = γ·x̂ + β\n\nμ_B, σ²_B: batch mean and variance (computed during training)\nγ, β: learnable scale and shift\n\nBenefits:\n• Reduces internal covariate shift — makes training stable\n• Allows much higher learning rates\n• Acts as mild regularizer\n• Reduces sensitivity to weight initialization",
      },
      {
        heading: "Layer Norm vs Batch Norm",
        body: "BatchNorm: normalizes over the batch dimension. Great for CNNs. Bad for variable-length sequences or small batches.\n\nLayerNorm: normalizes over the feature dimension per sample. Standard in Transformers. Works with batch_size=1.\n\nGroupNorm: normalizes over groups of channels. Good for object detection with small batch sizes.\n\nInstanceNorm: normalizes per sample per channel. Used in style transfer.",
      },
      {
        heading: "Dropout",
        body: "Dropout randomly zeros neuron outputs with probability p during training. Forces the network to learn redundant representations — acts as an ensemble of 2^N sub-networks.\n\nTraining: scale surviving activations by 1/(1-p)\nInference: no dropout, all neurons active\n\nTypical rates: p=0.1–0.3 for hidden layers, p=0.5 for large FC layers.\nDropout is less effective in CNNs — use SpatialDropout2D or BatchNorm instead.",
      },
      {
        heading: "BatchNorm & Dropout in Practice",
        code: `import torch
import torch.nn as nn

class RegularizedCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
            nn.Dropout2d(0.1),   # Spatial dropout for CNNs

            nn.Conv2d(64, 128, 3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(128, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.classifier(self.features(x))

# CRITICAL: switch modes for train vs eval
model = RegularizedCNN()
model.train()   # BatchNorm uses batch stats; Dropout is active
model.eval()    # BatchNorm uses running stats; Dropout is off
with torch.no_grad():
    output = model(torch.randn(1, 3, 32, 32))`,
        note: "Always call model.eval() before inference and model.train() before training. Forgetting this is one of the most common bugs in PyTorch.",
      },
    ],
  },
  {
    id: "cnn",
    title: "Convolutional Neural Networks (CNN)",
    category: "Deep Learning",
    content: [
      {
        heading: "Why CNNs for Images?",
        body: "A 224×224 RGB image has 150,528 pixels. A fully connected layer to 512 neurons would need 77M parameters — just for one layer. CNNs solve this with:\n\n1. Local receptive fields — each neuron only sees a small patch\n2. Weight sharing — same filter applied across all positions\n3. Spatial hierarchy — early layers detect edges, later layers detect objects",
      },
      {
        heading: "Convolution Operation",
        body: "Output = Input ★ Filter\n\nA filter (kernel) of size k×k slides across the input with stride s. At each position, element-wise multiply and sum.\n\nOutput size = (W − k + 2p) / s + 1\nWhere W=input width, k=kernel size, p=padding, s=stride\n\nWith padding=same: output has same spatial size as input.",
      },
      {
        heading: "Classic Architectures",
        body: "LeNet-5 (1998) — First practical CNN. 5 layers. MNIST handwriting.\nAlexNet (2012) — Won ImageNet by 10%+ margin. Introduced ReLU, Dropout, GPU training.\nVGG-16 (2014) — Very deep (16 layers), all 3×3 convolutions. Simple and effective.\nResNet-50 (2015) — 50 layers with skip connections. Won ImageNet 2015.\nEfficientNet (2019) — Compound scaling of depth/width/resolution. SOTA efficiency.\nConvNeXt (2022) — CNN redesigned to match ViT. Pure CNN, modern training tricks.",
      },
      {
        heading: "ResNet with Skip Connections",
        code: `import torch
import torch.nn as nn

class ResidualBlock(nn.Module):
    def __init__(self, channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, stride=stride, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(channels)
        self.relu  = nn.ReLU(inplace=True)

        # If stride > 1, input spatial size changes — need to match
        self.shortcut = nn.Sequential()
        if stride != 1:
            self.shortcut = nn.Sequential(
                nn.Conv2d(channels, channels, 1, stride=stride, bias=False),
                nn.BatchNorm2d(channels)
            )

    def forward(self, x):
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)  # Skip connection — key innovation
        return self.relu(out)

# Use torchvision for production-ready ResNets
import torchvision.models as models
resnet50 = models.resnet50(weights="IMAGENET1K_V2")
print(f"ResNet-50 parameters: {sum(p.numel() for p in resnet50.parameters()):,}")`,
        note: "Skip connections solve the vanishing gradient problem — gradients flow directly through identity shortcuts, enabling 100+ layer networks.",
      },
    ],
  },
  {
    id: "rnn-lstm",
    title: "RNNs, LSTMs & GRUs",
    category: "Deep Learning",
    content: [
      {
        heading: "Recurrent Neural Networks",
        body: "RNNs process sequential data by maintaining a hidden state h_t across time steps:\n\nh_t = tanh(W_h · h_{t-1} + W_x · x_t + b)\n\nThe same weights are used at every timestep. Output can be:\n• Many-to-one: sentiment analysis (all inputs → one label)\n• One-to-many: image captioning (one image → sequence of words)\n• Many-to-many: translation, POS tagging",
      },
      {
        heading: "Vanishing Gradient Problem",
        body: "During backpropagation through time (BPTT), gradients are multiplied by W_h at every step. If |W_h| < 1, gradients shrink exponentially. If |W_h| > 1, they explode.\n\nResult: Vanilla RNNs can only remember ~10 steps back. They fail at long-range dependencies.",
      },
      {
        heading: "LSTM — Long Short-Term Memory",
        body: "LSTM introduces a cell state C_t (long-term memory) with gating mechanisms:\n\nForget gate:  f_t = σ(W_f · [h_{t-1}, x_t] + b_f)  — what to erase\nInput gate:   i_t = σ(W_i · [h_{t-1}, x_t] + b_i)  — what to write\nCell update:  C̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)\nNew cell:     C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t\nOutput gate:  o_t = σ(W_o · [h_{t-1}, x_t] + b_o)\nHidden state: h_t = o_t ⊙ tanh(C_t)",
      },
      {
        heading: "GRU — Gated Recurrent Unit",
        body: "GRU is a simplified LSTM with only 2 gates (reset and update). Fewer parameters, trains faster, comparable performance to LSTM on most tasks.",
      },
      {
        heading: "Sequence Modeling with LSTMs",
        code: `import torch
import torch.nn as nn

class BiLSTMClassifier(nn.Module):
    """Bidirectional LSTM for sequence classification (e.g., sentiment analysis)"""
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=256, n_layers=2,
                 n_classes=2, dropout=0.3):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            embed_dim, hidden_dim, n_layers,
            batch_first=True, bidirectional=True, dropout=dropout
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim * 2, n_classes)  # *2 for bidirectional

    def forward(self, x, lengths):
        emb = self.dropout(self.embedding(x))
        # Pack to skip padding tokens in LSTM computation
        packed = nn.utils.rnn.pack_padded_sequence(
            emb, lengths.cpu(), batch_first=True, enforce_sorted=False
        )
        _, (hidden, _) = self.lstm(packed)
        # Concat final forward and backward hidden states
        hidden = torch.cat([hidden[-2], hidden[-1]], dim=1)
        return self.fc(self.dropout(hidden))

# GRU version (simpler, often just as good)
class GRUClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=256, n_classes=2):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.gru = nn.GRU(embed_dim, hidden_dim, batch_first=True, bidirectional=True)
        self.fc  = nn.Linear(hidden_dim * 2, n_classes)

    def forward(self, x):
        _, hidden = self.gru(self.embedding(x))
        return self.fc(torch.cat([hidden[-2], hidden[-1]], dim=1))`,
        note: "For NLP tasks today, Transformers outperform LSTMs. But LSTMs still excel at streaming time-series, sensor data, and tasks needing strict causality.",
      },
    ],
  },
  {
    id: "autoencoders",
    title: "Autoencoders",
    category: "Deep Learning",
    content: [
      {
        heading: "What is an Autoencoder?",
        body: "An Autoencoder is a neural network trained to compress input into a low-dimensional latent space and reconstruct it:\n\nInput x → Encoder → Latent z → Decoder → Reconstructed x̂\n\nLoss: Reconstruction loss = ||x − x̂||²\n\nThe bottleneck forces the network to learn the most important features. The latent space z is the learned representation.",
      },
      {
        heading: "Types of Autoencoders",
        body: "Undercomplete AE — Bottleneck smaller than input. Forces compression. Learns PCA-like linear representations.\n\nDenoising AE — Corrupts input with noise, trains to reconstruct clean version. Learns more robust features.\n\nSparse AE — Adds L1 penalty on activations. Learns sparse representations (few neurons active).\n\nVariational AE (VAE) — Learns a probability distribution in latent space. Enables generation of new samples. Foundation of modern generative models.",
      },
      {
        heading: "Variational Autoencoder (VAE)",
        body: "VAE encodes input as μ and σ (mean and std of a Gaussian). Sample z ~ N(μ, σ²).\n\nVAE Loss = Reconstruction Loss + KL Divergence\nKL divergence: regularizes the latent space to be close to N(0,1), enabling smooth interpolation and generation.",
      },
      {
        heading: "VAE Implementation",
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=400, latent_dim=20):
        super().__init__()
        # Encoder
        self.fc1   = nn.Linear(input_dim, hidden_dim)
        self.fc_mu  = nn.Linear(hidden_dim, latent_dim)   # Mean
        self.fc_var = nn.Linear(hidden_dim, latent_dim)   # Log variance

        # Decoder
        self.fc3 = nn.Linear(latent_dim, hidden_dim)
        self.fc4 = nn.Linear(hidden_dim, input_dim)

    def encode(self, x):
        h = F.relu(self.fc1(x))
        return self.fc_mu(h), self.fc_var(h)

    def reparameterize(self, mu, log_var):
        # Reparameterization trick: z = mu + eps*std (differentiable!)
        std = torch.exp(0.5 * log_var)
        eps = torch.randn_like(std)
        return mu + eps * std

    def decode(self, z):
        h = F.relu(self.fc3(z))
        return torch.sigmoid(self.fc4(h))

    def forward(self, x):
        mu, log_var = self.encode(x.view(-1, 784))
        z = self.reparameterize(mu, log_var)
        return self.decode(z), mu, log_var

def vae_loss(recon_x, x, mu, log_var, beta=1.0):
    recon_loss = F.binary_cross_entropy(recon_x, x.view(-1, 784), reduction="sum")
    kl_div = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
    return recon_loss + beta * kl_div`,
        note: "The reparameterization trick makes the sampling step differentiable — allowing gradients to flow through z back to the encoder.",
      },
    ],
  },
  {
    id: "gans",
    title: "Generative Adversarial Networks (GANs)",
    category: "Deep Learning",
    content: [
      {
        heading: "GAN Concept",
        body: "A GAN consists of two neural networks competing in a minimax game:\n\nGenerator G: Takes random noise z → generates fake data G(z)\nDiscriminator D: Takes real or fake data → outputs probability of being real\n\nMinMax objective:\nmin_G max_D E[log D(x)] + E[log(1 − D(G(z)))]\n\nD tries to maximize (correctly classify real vs fake)\nG tries to minimize (fool D into thinking fakes are real)",
      },
      {
        heading: "Training Challenges",
        body: "Mode Collapse — Generator produces only a few types of outputs, ignoring diversity.\nVanishing Gradients — When D is too good, gradients for G go to zero.\nTraining Instability — Loss oscillates, never converges cleanly.\n\nFixes:\n• Wasserstein GAN (WGAN) — uses Wasserstein distance instead of JS divergence. More stable.\n• Spectral Normalization — constrains D's Lipschitz constant\n• Progressive Growing — train at low resolution first, gradually increase",
      },
      {
        heading: "Famous GAN Variants",
        body: "DCGAN — Deep Convolutional GAN. Replaced FC layers with convolutions for image synthesis.\nStyleGAN2 — NVIDIA. Photo-realistic face generation. Style-based generator.\nConditional GAN (cGAN) — Generate images conditioned on a class label.\nCycleGAN — Image-to-image translation without paired data (horse↔zebra).\nPix2Pix — Paired image translation (sketch→photo, aerial→map).",
      },
      {
        heading: "DCGAN from Scratch",
        code: `import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, latent_dim=100, img_channels=1, features=64):
        super().__init__()
        self.net = nn.Sequential(
            # Input: (latent_dim, 1, 1)
            nn.ConvTranspose2d(latent_dim, features*8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(features*8), nn.ReLU(True),   # 4x4
            nn.ConvTranspose2d(features*8, features*4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(features*4), nn.ReLU(True),   # 8x8
            nn.ConvTranspose2d(features*4, features*2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(features*2), nn.ReLU(True),   # 16x16
            nn.ConvTranspose2d(features*2, img_channels, 4, 2, 1, bias=False),
            nn.Tanh()                                      # 32x32, range [-1,1]
        )
    def forward(self, z): return self.net(z)

class Discriminator(nn.Module):
    def __init__(self, img_channels=1, features=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(img_channels, features, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2, True),
            nn.Conv2d(features, features*2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(features*2), nn.LeakyReLU(0.2, True),
            nn.Conv2d(features*2, features*4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(features*4), nn.LeakyReLU(0.2, True),
            nn.Conv2d(features*4, 1, 4, 1, 0, bias=False),
            nn.Sigmoid()
        )
    def forward(self, x): return self.net(x).view(-1)

# Training step
G = Generator(); D = Discriminator()
opt_G = torch.optim.Adam(G.parameters(), lr=2e-4, betas=(0.5, 0.999))
opt_D = torch.optim.Adam(D.parameters(), lr=2e-4, betas=(0.5, 0.999))
criterion = nn.BCELoss()`,
        note: "Use betas=(0.5, 0.999) for GAN training — empirically found to stabilize training vs the default (0.9, 0.999).",
      },
    ],
  },
  {
    id: "diffusion-models",
    title: "Diffusion Models",
    category: "Deep Learning",
    content: [
      {
        heading: "What are Diffusion Models?",
        body: "Diffusion models are the current state-of-the-art in image generation (Stable Diffusion, DALL-E 3, Midjourney). They work by:\n\n1. Forward process: Gradually add Gaussian noise to data over T steps until image becomes pure noise\n2. Reverse process: Learn to denoise step by step, starting from pure noise to generate a clean image\n\nThe model learns: p(x_{t-1} | x_t) — given noisy image at step t, predict less noisy image at step t-1",
      },
      {
        heading: "DDPM — Denoising Diffusion Probabilistic Models",
        body: "Forward: q(x_t | x_{t-1}) = N(x_t; √(1-β_t)·x_{t-1}, β_t·I)\n\nβ_t is a noise schedule (linear or cosine). After T=1000 steps, x_T ≈ N(0,I).\n\nClosed-form shortcut: x_t = √(ᾱ_t)·x_0 + √(1-ᾱ_t)·ε\nWhere ᾱ_t = Π βᵢ and ε ~ N(0,I)\n\nThe neural network (U-Net) is trained to predict the noise ε given (x_t, t).",
      },
      {
        heading: "Classifier-Free Guidance (CFG)",
        body: "For text-to-image: the model generates both conditioned (text prompt) and unconditioned outputs:\n\nε_guided = ε_uncond + w · (ε_cond − ε_uncond)\n\nGuidance scale w controls how strongly the image follows the prompt. Higher w = more prompt-adherent but less diverse.",
      },
      {
        heading: "Minimal Diffusion Forward Process",
        code: `import torch
import torch.nn as nn
import numpy as np

# Noise schedule (cosine — more stable than linear)
def cosine_beta_schedule(timesteps, s=0.008):
    steps = timesteps + 1
    x = torch.linspace(0, timesteps, steps)
    alphas_cumprod = torch.cos(((x / timesteps) + s) / (1 + s) * np.pi * 0.5) ** 2
    alphas_cumprod = alphas_cumprod / alphas_cumprod[0]
    betas = 1 - (alphas_cumprod[1:] / alphas_cumprod[:-1])
    return torch.clamp(betas, 0.0001, 0.9999)

T = 1000
betas = cosine_beta_schedule(T)
alphas = 1. - betas
alphas_cumprod = torch.cumprod(alphas, dim=0)
sqrt_alphas_cumprod = torch.sqrt(alphas_cumprod)
sqrt_one_minus = torch.sqrt(1. - alphas_cumprod)

def q_sample(x_0, t, noise=None):
    """Add noise to x_0 to get x_t in ONE step (closed-form)"""
    if noise is None:
        noise = torch.randn_like(x_0)
    return (sqrt_alphas_cumprod[t] * x_0 +
            sqrt_one_minus[t] * noise), noise

# Simulate noising an image
x_0 = torch.randn(1, 3, 64, 64)  # clean image
for t in [0, 100, 500, 999]:
    x_t, _ = q_sample(x_0, t)
    noise_level = sqrt_one_minus[t].item()
    print(f"t={t:4d}: noise_std={noise_level:.3f} signal_std={sqrt_alphas_cumprod[t]:.3f}")`,
        note: "Diffusion models are slower to sample than GANs (need T denoising steps) but produce much higher quality and more diverse outputs.",
      },
    ],
  },
]
