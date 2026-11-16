"""Check the published legacy-project predictions against captured pinned originals."""
from pathlib import Path
import ast,contextlib,hashlib,io,json,math
from collections import deque

root=Path(__file__).resolve().parents[1]
fixture=json.loads((root/"test/fixtures/ai-all-source-leaves.json").read_text())
checks=0
loaded={}
def check(value,label):
    global checks
    if not value:raise AssertionError(label)
    checks+=1
def load(folder):
    if folder in loaded:return loaded[folder]
    project=next(p for p in fixture["projects"] if p["folder"]==folder)
    item=next(f for f in project["files"] if f["name"]=="main.py")
    original=fixture["files"][item["key"]]
    body=original["content"]
    check(hashlib.sha256(body.encode()).hexdigest()==original["sha256"],folder+" original identity")
    tree=ast.parse(body)
    tree.body=[n for n in tree.body if isinstance(n,(ast.Import,ast.ImportFrom,ast.FunctionDef,ast.ClassDef))]
    scope={"__name__":"captured_reference_contract"}
    exec(compile(tree,folder,"exec"),scope)
    loaded[folder]=scope
    return scope
def output(fn,*args):
    target=io.StringIO()
    with contextlib.redirect_stdout(target):fn(*args)
    return target.getvalue().split()
def graph(scope,edges,keys="abcde"):
    g=scope["Graph"]();nodes={k:scope["Node"](k) for k in keys}
    for n in nodes.values():g.add_node(n)
    for edge in edges:g.add_edge(*(nodes[k] for k in edge))
    return g,nodes
def board(text,empty="-"):
    return [list(text[i:i+3].replace("-",empty)) for i in range(0,9,3)]

s=load("FAI1-Dog-Class");a=s["Dog"]("Fido",4);b=s["Dog"]("Luna",2)
a.learn_trick("roll");check(a.tricks==["roll"] and b.tricks==[],"independent dog state")
a.sit_down();check(a.get_state()=="Fido is sitting","sit")
a.stand_up();check(a.get_state()=="Fido is standing" and a.do_trick()=="roll","stand and sole trick")
check(b.do_trick()=="Luna doesn't know any tricks!","empty tricks")
s=load("FAI1-Deck-of-Cards");deck=s["Deck"]()
pairs=lambda d:[(c.value,c.suit) for c in d.deck]
original=set(pairs(deck))
check(original=={(n,suit) for n in range(1,14) for suit in ["Spades","Hearts","Clubs","Diamonds"]},"52 card membership")
deck.shuffle();check(len(deck.deck)==52 and set(pairs(deck))==original,"shuffle permutation")
drawn=[deck.draw_card() for _ in range(52)]
check({(c.value,c.suit) for c in drawn}==original and len(deck.deck)==0,"draw each once")
with contextlib.redirect_stdout(io.StringIO()):check(deck.draw_card() is None,"empty draw")
s=load("FAI4-Practice-with-Stacks")
for word,want in [("racecar",True),("mom",True),("hello world",False)]:check(s["isPalindrome"](word)==want,"palindrome "+word)
for text,want in [("2 3 +",5),("1 3 -",-2),("3 5 + 4 *",32)]:check(s["evaluateExpression"](text)==want,"RPN "+text)
s=load("FAI4-Practice-with-Queues")
for text,want in [("H*ELL**O**","HELLO"),("AB**","AB")]:check(s["buildQueueString"](text)==want,"queue string")
values=[1,2,6,5,4,6];check(s["getEvens"](values)==[2,6,4,6] and values==[],"consume and preserve even ordering")
check(s["getEvens"]([])==[] and s["getEvens"]([1,3])==[],"empty even output")
edges=[("a","b"),("a","c"),("b","d"),("b","e")]
s=load("FAI5-Implement-DFS");g,n=graph(s,edges)
check(output(g.dfs_iterative,n["a"])==list("acbed"),"iterative DFS")
check(output(g.dfs_recursive,set(),n["a"])==list("abdec"),"recursive DFS")
s=load("FAI6-Implement-BFS");g,n=graph(s,edges)
check(output(g.bfs,n["a"])==list("abcde"),"BFS")
for folder,method,want in [("FAI5-DFS-With-a-Stack-Class","dfs_with_stack_class","acbed"),("FAI6-BFS-With-a-Queue-Class","bfs_with_queue_class","abcde")]:
    s=load(folder);g,n=graph(s,edges);check(output(getattr(g,method),n["a"])==list(want),folder)
s=load("FAI9-Implement-DLS");g,n=graph(s,[("a","b"),("a","c"),("b","e"),("c","d"),("d","e")])
for limit,want in [(0,"a"),(1,"acb"),(2,"acdbe"),(3,"acdeb"),(4,"acdeb"),(-1,"")]:
    check(output(g.dls,n["a"],limit)==list(want),"DLS "+str(limit))
s=load("FAI9-Implement-IDS");g,n=graph(s,[("a","b"),("a","c"),("b","e"),("c","d"),("d","e")])
check(output(g.ids,n["a"],4)==list("a"+"acb"+"acdbe"+"acdeb"+"acdeb"),"IDS inclusive repetitions")
s=load("FAI9-Implement-UCS");g=s["Graph"]();nodes={k:s["Node"](k) for k in "abcde"}
for n in nodes.values():g.add_node(n)
for a,b,c in [("a","b",3),("a","c",5),("a","e",15),("b","d",1),("b","e",6)]:g.add_edge(nodes[a],nodes[b],c)
words=output(g.ucs,nodes["a"]);check([words[i] for i in range(0,len(words),6)]==list("abdce"),"UCS settled order")
check([int(words[i]) for i in range(5,len(words),6)]==[0,3,4,5,9],"UCS settled costs")
s=load("FAI5-Juni-Book")
g=s["FriendGraph"]();nodes={k:s["Node"](k) for k in "pqrs"}
for n in nodes.values():g.add_node(n)
g.add_edge(nodes["p"],nodes["q"]);check(g.count_groups()==3,"three components")
g.add_edge(nodes["r"],nodes["s"]);check(g.count_groups()==2,"two components")
g.add_edge(nodes["q"],nodes["r"]);check(g.count_groups()==1,"one component")
check(s["FriendGraph"]().count_groups()==0,"empty components")
s=load("FAI7-Tic-Tac-Toe-Tree-Node")
for text,want in [("---------",(None,False)),("XXXOO----",("X",True)),("XOXXOOOXX",("draw",True))]:
    check(s["TreeNode"](board(text),"O").check_win()==want,"terminal "+text)
for folder,empty in [("FAI7-Unbeatable-Tic-Tac-Toe-AI","-"),("FAI7-Updated-Tic-Tac-Toe-AI"," ")]:
    s=load(folder)
    for text in ["XX-OO----","OO-X---X-"]:
        rootnode=s["TreeNode"](board(text,empty),"X")
        with contextlib.redirect_stdout(io.StringIO()):tree=s["Tree"](rootnode)
        check(rootnode.best_child.board[0][2]=="X",folder+" win/block")
s=load("FAI8-The-Marble-Game-AI")
for count in [1,4,5]:
    node=s["TreeNode"](count,True);tree=s["Tree"](node)
    check((node.score<0)==(count!=4),"AI winning pile "+str(count))
    if count==5:check(node.best_child.num_marbles==4,"leave four")
s=load("FAI10-Water-Jug-Riddle")
route=[(0,0),(0,5),(3,2),(0,2),(2,0),(2,5),(3,4)]
for before,after in zip(route,route[1:]):
    n=s["Node"](*before);n.generate_neighbors();check(after in [tuple(v.state) for v in n.neighbors],"jug transition")
g=s["Graph"](s["Node"](0,0))
with contextlib.redirect_stdout(io.StringIO()):path,count=g.a_star_solve()
check(len(path)-1==6 and path[-1].is_solved(),"jug six-action minimum")
s=load("FAI11-8-Puzzle-Solver")
for text,want in [("123456-78",2),("12345678-",0),("12345687-",None)]:
    g=s["PuzzleGraph"](s["Node"](board(text," ")))
    for method in [g.bfs_solve,g.a_star_solve]:
        with contextlib.redirect_stdout(io.StringIO()):result=method()
        check(result is None if want is None else len(result[0])-1==want,"puzzle moves/parity "+text)
s=load("FAI1-Bank-Account-Class");a=s["BankAccount"]("Example",.1)
for method,amount,want in [(a.deposit,1000,1000),(a.calculate_interest,None,1100),(a.withdraw,1000,100),(a.withdraw,150,100)]:
    with contextlib.redirect_stdout(io.StringIO()):
        method() if amount is None else method(amount)
    check(math.isclose(a.balance,want),"balance "+str(want))
for amount in [-1,float("inf"),float("nan")]:
    before=a.balance
    try:a.deposit(amount)
    except ValueError:pass
    else:raise AssertionError("invalid amount accepted")
    check(a.balance==before,"reject before mutation")
adj={(0,0):[(0,1),(1,0)],(0,1):[(0,0),(0,2)],(0,2):[(0,1),(1,2)],(1,0):[(0,0),(1,1)],(1,1):[(1,0),(2,1)],(1,2):[(0,2),(2,2)],(2,0):[(2,1)],(2,1):[(1,1),(2,0),(2,2)],(2,2):[(1,2),(2,1)]}
routes=[]
def enumerate_paths(at,path):
    if at==(2,0):routes.append(path);return
    for nxt in adj[at]:
        if nxt not in path:enumerate_paths(nxt,path+[nxt])
enumerate_paths((0,0),[(0,0)])
cost=lambda route:sum(5 if p==(1,1) else 1 for p in route[:-1])
check(min(len(p)-1 for p in routes)==4,"maze minimum moves")
check(sorted((len(p)-1,cost(p)) for p in routes)==[(4,8),(6,6)],"maze move/cost tradeoff")
print(json.dumps({"accepted":True,"checks":checks,"actualPinnedSourcePrograms":len(loaded),"sourceFixtureSHA256":hashlib.sha256((root/"test/fixtures/ai-all-source-leaves.json").read_bytes()).hexdigest(),"mainProgramsAndInteractiveLoopsNotExecuted":True}))
