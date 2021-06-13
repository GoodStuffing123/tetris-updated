import React from "react";

class Play extends React.Component {
  posShapes = [
    [
      [0, -2],
      [0, -1],
      [0, 0],
      [0, 1]
    ],
    [
      [0, -1],
      [-1, 0],
      [0, 0],
      [1, 0]
    ],
    [
      [0, 0],
      [1, 0],
      [-1, 1],
      [0, 1]
    ],
    [
      [-1, 0],
      [0, 0],
      [0, 1],
      [1, 1]
    ],
    [
      [0, -1],
      [1, -1],
      [0, 0],
      [0, 1]
    ],
    [
      [0, -1],
      [-1, -1],
      [0, 0],
      [0, 1]
    ],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ]
  ];

  getRandomShape = () => {
    const shape = [];

    this.posShapes[Math.floor(Math.random() * this.posShapes.length)].forEach(
      pos => {
        shape.push(pos);
      }
    );

    return shape;
  };

  handleKeyDown = e => {
    if (!this.dead) {
      switch (e.key.toLowerCase()) {
        case "a": {
          let ok = true;

          this.shape.pos.forEach((pos, i) => {
            if (this.shape.x + pos[0] - 1 < 0) {
              ok = false;
            } else {
              const point =
                this.shape.y + pos[1] >= 0
                  ? this.grid[this.shape.y + pos[1]][this.shape.x + pos[0] - 1]
                  : null;

              if (point && point.active) {
                ok = false;
              }
            }
          });

          if (ok) {
            this.shape.x -= 1;
          }

          this.updateGhost();

          this.offset.x2 = -5;
          break;
        }

        case "d": {
          let ok = true;

          this.shape.pos.forEach((pos, i) => {
            if (this.shape.x + pos[0] + 1 >= this.grid[0].length) {
              ok = false;
            } else {
              const point =
                this.shape.y + pos[1] >= 0
                  ? this.grid[this.shape.y + pos[1]][this.shape.x + pos[0] + 1]
                  : null;

              if (point && point.active) {
                ok = false;
              }
            }
          });

          if (ok) {
            this.shape.x += 1;
          }

          this.updateGhost();

          this.offset.x2 = 5;
          break;
        }

        case "w": {
          let ok = true;

          this.shape.pos.forEach((_, i) => {
            const pos = [...this.shape.pos[i]];

            const pos1 = [...pos];
            const pos2 = [...pos];
            pos1[0] = -pos2[1];
            pos1[1] = pos2[0];
            this.shape.pos[i] = [...pos1];

            if (
              this.shape.x + this.shape.pos[i][0] < 0 ||
              this.shape.x + this.shape.pos[i][0] >= this.grid[0].length ||
              this.shape.y + this.shape.pos[i][1] >= this.grid.length
            ) {
              ok = false;
            } else {
              const point =
                this.shape.y + this.shape.pos[i][1] >= 0 &&
                this.shape.y + this.shape.pos[i][1] < this.grid.length
                  ? this.grid[this.shape.y + this.shape.pos[i][1]][
                      this.shape.x + this.shape.pos[i][0]
                    ]
                  : null;

              if (point && point.active) {
                ok = false;
              }
            }
          });

          if (!ok) {
            this.shape.pos.forEach((_, i) => {
              const pos = [...this.shape.pos[i]];

              const pos1 = [...pos];
              const pos2 = [...pos];
              pos1[0] = pos2[1];
              pos1[1] = -pos2[0];
              this.shape.pos[i] = [...pos1];
            });
          }

          this.updateGhost();
          break;
        }

        case "s": {
          let ok = true;

          this.shape.pos.forEach((pos, i) => {
            const point =
              this.shape.y + pos[1] + 1 < this.grid.length &&
              this.shape.y + pos[1] + 1 >= 0
                ? this.grid[this.shape.y + pos[1] + 1][this.shape.x + pos[0]]
                : null;

            if (point && point.active) {
              ok = false;
            } else if (this.shape.y + pos[1] + 1 >= this.grid.length) {
              ok = false;
            }
          });

          if (ok) {
            this.shape.y++;
          }

          this.offset.y2 = 5;
          break;
        }

        case " ": {
          this.shape.pos.forEach((pos, i) => {
            for (let i = 0; i < 10; i++) {
              this.particles.push({
                x: this.offset.x + (this.shape.x + pos[0]) * this.square.size,
                y: this.offset.y + (this.shape.y + pos[1]) * this.square.size,
                vx: Math.random() * 1 - 0.5,
                vy: Math.random() * 5,
                size: 3,
                color: "yellow",
                life: Math.floor(Math.random() * 120)
              });
            }
          });

          this.shape = { ...this.ghost };

          this.offset.y2 = 30;

          this.tick = this.maxTick;
          break;
        }

        case "e": {
          const prev = [...this.shape.pos];

          if (this.stored) {
            this.shape = { x: 4, y: -2 };

            this.shape.pos = [...this.stored];
            this.stored = prev;
          } else {
            this.stored = prev;
            this.resetShape();
          }
          break;
        }
        default:
      }
    }
  };

  runEffects = () => {
    const partsToDel = [];

    this.particles.forEach((part, i) => {
      part.x += part.vx;
      part.y += part.vy;

      this.ctx.fillStyle = part.color;

      this.ctx.fillRect(part.x, part.y, part.size, part.size);

      part.life--;

      if (part.life <= 0) {
        partsToDel.push(i);
      }
    });

    partsToDel.sort((a, b) => b - a);

    partsToDel.forEach((part, i) => {
      this.particles.splice(part, 1);
    });
  };

  updateGhost = () => {
    this.ghost = { ...this.shape };

    let looping = true;

    while (looping) {
      let ok = true;

      this.ghost.pos.forEach((pos, i) => {
        const point =
          this.ghost.y + pos[1] + 1 < this.grid.length &&
          this.ghost.y + pos[1] + 1 >= 0
            ? this.grid[this.ghost.y + pos[1] + 1][this.ghost.x + pos[0]]
            : null;

        if (point && point.active) {
          ok = false;
        } else if (this.ghost.y + pos[1] + 1 >= this.grid.length) {
          ok = false;
        }
      });

      if (ok) {
        this.ghost.y++;
      } else {
        looping = false;
      }
    }
  };

  resetShape = () => {
    this.shape = { x: 4, y: -2 };

    if (!this.nextShape) {
      this.shape.pos = [...this.getRandomShape()];
    } else {
      this.shape.pos = [];

      this.nextShape.forEach(pos => {
        this.shape.pos.push(pos);
      });
    }

    this.nextShape = [...this.getRandomShape()];

    this.updateGhost();

    this.score += 10;
  };

  playGame = () => {
    this.ctx = this.Canvas.getContext("2d");

    this.particles = [];

    this.grid = [];
    for (let y = 0; y < 21; y++) {
      const row = [];
      for (let x = 0; x < 10; x++) {
        const col = { active: false };
        row.push(col);
      }
      this.grid.push(row);
    }

    this.square = { size: 30, spacing: 5 };
    this.offset = {
      x: this.Canvas.width / 2 - (this.grid[0].length * this.square.size) / 2,
      y: this.Canvas.height / 2 - (this.grid.length * this.square.size) / 2,
      x2: 0,
      y2: 0
    };

    this.resetShape();

    window.addEventListener("keydown", this.handleKeyDown);

    this.score = 0;

    this.timeMult = 1;

    this.powerTime = 0;
    this.colorScheme = {};

    this.tick = 0;
    this.maxTick = 30;
    this.playInterval = setInterval(() => {
      if (this.tick >= this.maxTick * this.timeMult) {
        let ok = true;

        this.shape.pos.forEach((pos, i) => {
          const point =
            this.shape.y + pos[1] + 1 < this.grid.length &&
            this.shape.y + pos[1] + 1 >= 0
              ? this.grid[this.shape.y + pos[1] + 1][this.shape.x + pos[0]]
              : null;

          if (point && point.active) {
            ok = false;
          } else if (this.shape.y + pos[1] + 1 >= this.grid.length) {
            ok = false;
          }
        });

        if (ok) {
          this.shape.y++;
        } else {
          this.shape.pos.forEach(pos => {
            if (this.shape.y + pos[1] >= 0) {
              this.grid[this.shape.y + pos[1]][
                this.shape.x + pos[0]
              ].active = true;
            } else {
              this.dead = true;
            }
          });

          this.resetShape();
        }

        this.grid.forEach((row, y) => {
          let strike = true;

          row.forEach((col, x) => {
            if (!this.grid[y][x].active) {
              strike = false;
            }
          });

          if (strike) {
            const nextGrid = [...this.grid];

            this.grid.forEach((row2, y2) => {
              if (y2 <= y) {
                if (y2 === 0) {
                  const empty = [];
                  for (let i = 0; i < this.grid[0].length; i++) {
                    empty.push({ active: false });
                  }

                  nextGrid[y2] = empty;
                } else {
                  nextGrid[y2] = this.grid[y2 - 1];
                }
              }
            });

            this.grid = nextGrid;

            row.forEach((col, x) => {
              for (let i = 0; i < 30; i++) {
                this.particles.push({
                  x: this.offset.x + x * this.square.size,
                  y: this.offset.y + y * this.square.size,
                  vx: Math.random() * 2 - 1,
                  vy: Math.random() * 3 - 1,
                  size: 3,
                  color: "yellow",
                  life: Math.floor(Math.random() * 120)
                });
              }
            });

            this.score += 50;

            if (this.powerTime < 600) {
              this.powerTime += 60;
            }
          }
        });

        this.updateGhost();

        this.tick = 0;
      }

      if (!this.dead) {
        this.tick++;
      } else {
        let finished = true;

        for (let y = 0; y < this.grid.length; y++) {
          for (let x = 0; x < this.grid[0].length; x++) {
            if (this.grid[y][x].active) {
              this.grid[y][x].active = false;

              for (let i = 0; i < 50; i++) {
                this.particles.push({
                  x: this.offset.x + x * this.square.size,
                  y: this.offset.y + y * this.square.size,
                  vx: Math.random() * 10 - 5,
                  vy: Math.random() * 10 - 5,
                  size: 3,
                  color: "yellow",
                  life: Math.floor(Math.random() * 120)
                });
              }

              x = this.grid[0].length;
              y = this.grid.length;

              finished = false;
            }
          }
        }

        if (finished) {
          this.dead = false;

          this.resetShape();

          this.score = 0;
        }
      }

      this.offset.x2 *= 0.95;
      this.offset.y2 *= 0.95;

      const offset = {
        x: this.offset.x + this.offset.x2,
        y: this.offset.y + this.offset.y2
      };

      if (this.powerTime > 0) {
        this.powerTime -= 0.2;
      }

      if (this.powerTime <= 180) {
        this.colorScheme = { box: "darkgrey", square: "grey" };
      } else {
        this.colorScheme = { box: "black", square: "white" };
      }

      this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

      this.ctx.fillStyle = this.colorScheme.box;

      this.ctx.fillRect(
        offset.x,
        offset.y,
        this.grid[0].length * this.square.size - this.square.spacing,
        this.grid.length * this.square.size - this.square.spacing
      );

      this.ctx.fillRect(
        offset.x + this.grid[0].length * this.square.size,
        offset.y,
        6 * this.square.size - this.square.spacing,
        6 * this.square.size - this.square.spacing
      );

      this.ctx.fillRect(
        offset.x - 6 * this.square.size,
        offset.y,
        6 * this.square.size - this.square.spacing,
        6 * this.square.size - this.square.spacing
      );

      this.ctx.fillStyle = this.colorScheme.square;

      this.grid.forEach((row, y) => {
        row.forEach((col, x) => {
          if (col.active) {
            this.ctx.fillRect(
              offset.x + x * this.square.size,
              offset.y + y * this.square.size,
              this.square.size - this.square.spacing,
              this.square.size - this.square.spacing
            );
          }
        });
      });

      this.ctx.strokeStyle = this.colorScheme.square;
      this.ctx.lineWidth = 2;

      this.ghost.pos.forEach(pos => {
        if (this.ghost.y + pos[1] >= 0) {
          this.ctx.strokeRect(
            offset.x + (this.ghost.x + pos[0]) * this.square.size,
            offset.y + (this.ghost.y + pos[1]) * this.square.size,
            this.square.size - this.square.spacing,
            this.square.size - this.square.spacing
          );
        }
      });

      this.shape.pos.forEach(pos => {
        if (this.shape.y + pos[1] >= 0) {
          this.ctx.fillRect(
            offset.x + (this.shape.x + pos[0]) * this.square.size,
            offset.y + (this.shape.y + pos[1]) * this.square.size,
            this.square.size - this.square.spacing,
            this.square.size - this.square.spacing
          );
        }
      });

      if (this.stored) {
        this.stored.forEach(pos => {
          this.ctx.fillRect(
            offset.x - (4 - pos[0]) * this.square.size,
            offset.y + (3 + pos[1]) * this.square.size,
            this.square.size - this.square.spacing,
            this.square.size - this.square.spacing
          );
        });
      }

      this.nextShape.forEach(pos => {
        this.ctx.fillRect(
          offset.x + (this.grid[0].length + 2 + pos[0]) * this.square.size,
          offset.y + (3 + pos[1]) * this.square.size,
          this.square.size - this.square.spacing,
          this.square.size - this.square.spacing
        );
      });

      this.ctx.fillStyle = "white";
      this.ctx.font = "30px serif";

      this.ctx.fillText(`Score: ${this.score}`, offset.x, offset.y - 20);

      this.runEffects();
    }, 1000 / 60);
  };

  handleResize = () => {
    this.Canvas.width = window.innerWidth;
    this.Canvas.height = window.innerHeight;
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);

    this.playGame();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);

    clearInterval(this.playInterval);
  }

  render() {
    return (
      <canvas
        id="canvas"
        ref={Canvas => {
          this.Canvas = Canvas;
        }}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    );
  }
}

export default Play;
