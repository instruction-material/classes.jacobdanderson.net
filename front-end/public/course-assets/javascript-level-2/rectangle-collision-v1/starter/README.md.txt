# Rectangular Collision

Open index.html without a server. Draw two random rectangles on the 550-by-500 canvas and display whether they touch or overlap. Reload for a new pair. The starter supplies random generation,drawing and result display;complete rectanglesTouch.

Each rectangle stores x,y,width,height and color. Generate width and height as integers 100..299 first. Choose x in 50..canvas.width-50-width and y in 50..canvas.height-50-height,including both endpoints. This leaves a 50-unit margin and keeps every edge visible. RGB components are integers 0..254,matching the original palette.

Compute left=x,right=x+width,top=y,bottom=y+height. The x ranges touch/overlap if a.right>=b.left AND a.left<=b.right. Apply the same test vertically,and combine all four comparisons with AND. Edge and corner contact count as collision;separation on either axis means false. No rotation or negative dimensions are used.

For a=(50,50,100,100) and b=(150,75,100,100),the rectangles touch at x150: true. Move b.x to151:false. For b=(75,150,100,100),they touch horizontally along y150:true. The original reference uses strict overlap and can clip randomly generated rectangles;this version follows the original task's touching rule and bounds both shapes.

Show overlapping,edge-touching,corner-touching,contained and separated cases from CASES.md. Save the chosen fixed inputs when explaining a result.
