# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - heading "📝 Todo Board" [level=1] [ref=e4] [cursor=pointer]
      - button "Switch to Dark Mode" [ref=e6]:
        - img
  - main [ref=e7]:
    - generic [ref=e9]:
      - generic [ref=e11]: Login
      - generic [ref=e13]:
        - textbox "Enter your email" [ref=e15]
        - textbox "Enter password" [ref=e17]
        - button "Login" [ref=e18]
      - generic [ref=e20]:
        - generic [ref=e21]: Not an user ?
        - button "Register Here" [ref=e22]
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e28] [cursor=pointer]:
    - img [ref=e29] [cursor=pointer]
  - alert [ref=e32]
```