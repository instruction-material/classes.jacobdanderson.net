"""Execute the published foundation examples against independently derived cases."""
from pathlib import Path
from collections import deque
from functools import lru_cache
from fractions import Fraction
from itertools import combinations, permutations
import hashlib,json,re

source=Path(__file__).resolve().parents[1]/"front-end/src/stores/courses/aiFoundationReadingsData.json"
raw=source.read_bytes()
rows=json.loads(raw)
by_title={r["title"]:r for r in rows}
checks=0
def check(value,message):
    global checks
    if not value:raise AssertionError(message)
    checks+=1
def snippet(title):
    content=by_title[title]["content"]
    blocks=re.findall(chr(96)*3+"python\\n(.*?)"+chr(96)*3,content,re.S)
    check(len(blocks)==1,"one executable example in "+title)
    scope={}
    exec(compile(blocks[0],title,"exec"),scope)
    return scope

bfs=snippet("DFS, BFS, and Reachability Core Concepts")["bfs"]
edges=[(a,b) for a in "SAG" for b in "SAG" if a!=b]
# Enumerating all simple paths is independent of queue/parent reconstruction.
for mask in range(1<<len(edges)):
    graph={a:[] for a in "SAG"}
    for bit,(a,b) in enumerate(edges):
        if mask&(1<<bit):graph[a].append(b)
    for start in graph:
        for goal in graph:
            candidates=[]
            for length in range(1,4):
                for route in permutations(graph,length):
                    if route[0]==start and route[-1]==goal and all(b in graph[a] for a,b in zip(route,route[1:])):
                        candidates.append(route)
            path=bfs(graph,start,goal)
            if candidates:
                check(path[0]==start and path[-1]==goal,"endpoints")
                check(all(b in graph[a] for a,b in zip(path,path[1:])),"legal BFS path")
                check(len(path)==min(map(len,candidates)),"minimum edges")
            else:check(path==[],"unreachable BFS case")
act=snippet("Rule-Based Systems and Puzzle Framing Core Concepts")["act"]
transitions={
 (("hall",False),"store"):("store",False),
 (("hall",True),"store"):("store",True),
 (("store",False),"return"):("hall",True),
 (("store",True),"return"):("hall",True),
 (("hall",True),"exit"):("outside",True)
}
for room in ["hall","store","outside"]:
    for key in [False,True]:
        for action in ["store","return","exit","invalid"]:
            state=(room,key)
            check(act(state,action)==transitions.get((state,action),state),"complete state transition")
state=("hall",False)
for action in ["store","return","exit"]:state=act(state,action)
check(state==("outside",True),"keyed exit sequence")
def removals(pending,take):
    pending.append("S");out=[take()]
    pending.extend(["A","B"]);out.append(take())
    pending.append("C")
    while pending:out.append(take())
    return out
stack=[];queue=deque()
check(removals(stack,stack.pop)==["S","B","C","A"],"stack trace")
check(removals(queue,queue.popleft)==["S","A","B","C"],"queue trace")

weighted={"S":[("A",1),("B",5)],"A":[("G",20)],"B":[("G",1)],"G":[]}
routes=[]
def enumerate_routes(state,path,cost):
    if state=="G":routes.append((path,cost));return
    for neighbor,step in weighted[state]:
        if neighbor not in path:enumerate_routes(neighbor,path+[neighbor],cost+step)
enumerate_routes("S",["S"],0)
check(sorted(cost for _,cost in routes)==[6,21],"independent weighted route enumeration")
check(sum(Fraction(x) for x in [21,2,0])/3==Fraction(23,3),"greedy comparable-case mean")
check(sum(Fraction(x) for x in [6,2,0])/3==Fraction(8,3),"A* comparable-case mean")
winning_lines=((0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6))
@lru_cache(None)
def value(board,turn):
    for a,b,c in winning_lines:
        if board[a]!="-" and board[a]==board[b]==board[c]:return 1 if board[a]=="O" else -1
    if "-" not in board:return 0
    values=[value(board[:i]+(turn,)+board[i+1:],"X" if turn=="O" else "O") for i,x in enumerate(board) if x=="-"]
    return max(values) if turn=="O" else min(values)
def optimal(board,turn):
    scores={i:value(board[:i]+(turn,)+board[i+1:],"X" if turn=="O" else "O") for i,x in enumerate(board) if x=="-"}
    best=max(scores.values()) if turn=="O" else min(scores.values())
    return [i for i,v in scores.items() if v==best]
check(value(tuple("---------"),"X")==0,"empty-board complete search")
check(2 in optimal(tuple("XX-OO----"),"X"),"X wins at index2")
check(optimal(tuple("OO-X---X-"),"X")==[2],"X forced block at index2")
goal=(1,2,3,4,5,6,7,8,0);start=(1,2,3,4,5,6,0,7,8);middle=(1,2,3,4,5,6,7,0,8)
def adjacent(board):
    blank=board.index(0);r,c=divmod(blank,3)
    for nr,nc in [(r-1,c),(r+1,c),(r,c-1),(r,c+1)]:
        if 0<=nr<3 and 0<=nc<3:
            other=nr*3+nc;out=list(board);out[blank],out[other]=out[other],out[blank];yield tuple(out)
check(middle in adjacent(start) and goal in adjacent(middle),"two legal 8-puzzle moves")
check(goal not in adjacent(start),"one move cannot solve example")
distance=sum(abs(divmod(i,3)[0]-divmod(tile-1,3)[0])+abs(divmod(i,3)[1]-divmod(tile-1,3)[1]) for i,tile in enumerate(start) if tile)
check(distance==2,"numbered-tile Manhattan excludes blank")
unsolvable=(1,2,3,4,5,6,8,7,0)
inversions=sum(a>b for a,b in combinations([x for x in unsolvable if x],2))
check(inversions==1,"odd inversion counterexample")
print(json.dumps({"allChecksPassed":True,"checks":checks,"directedGraphs":64,"BFSRequests":576,"stateTransitionCases":24,"dataSHA256":hashlib.sha256(raw).hexdigest(),"codeBlocksExecuted":2}))
