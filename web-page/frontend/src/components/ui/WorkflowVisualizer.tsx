import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Handle, 
  Position,
  MarkerType,
  type Node,
  type Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

const CustomNode = ({ data }: any) => {
  return (
    <div className={`px-4 py-3 shadow-xl rounded-2xl border-2 transition-all duration-300 min-w-[180px] ${
      data.type === 'ceo' ? 'bg-slate-900 border-luxury-blue text-white' :
      data.type === 'manager' ? 'bg-white border-slate-200 text-slate-900' :
      'bg-slate-50 border-dashed border-slate-300 text-slate-500'
    }`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-luxury-blue border-2 border-white" />
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
          data.type === 'ceo' ? 'bg-luxury-blue text-white' : 'bg-slate-100 text-slate-600'
        }`}>
          {data.icon}
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{data.role}</p>
          <p className="text-xs font-bold leading-none mt-0.5">{data.label}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-luxury-blue border-2 border-white" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  { 
    id: 'ceo-1', 
    type: 'custom',
    data: { label: 'Project Initiation', role: 'CEO STRATEGY', icon: '🎯', type: 'ceo' }, 
    position: { x: 250, y: 0 } 
  },
  { 
    id: 'manager-1', 
    type: 'custom',
    data: { label: 'Project Planning', role: 'MANAGER OPS', icon: '📋', type: 'manager' }, 
    position: { x: 250, y: 120 } 
  },
  { 
    id: 'lead-1', 
    type: 'custom',
    data: { label: 'Task Execution', role: 'TEAM LEAD', icon: '⚡', type: 'manager' }, 
    position: { x: 100, y: 240 } 
  },
  { 
    id: 'lead-2', 
    type: 'custom',
    data: { label: 'Resource Mgmt', role: 'HR LEAD', icon: '👥', type: 'manager' }, 
    position: { x: 400, y: 240 } 
  },
  { 
    id: 'analytics-1', 
    type: 'custom',
    data: { label: 'Insights & ROI', role: 'SYSTEM AI', icon: '🧠', type: 'manager' }, 
    position: { x: 250, y: 360 } 
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'ceo-1', target: 'manager-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e2-3', source: 'manager-1', target: 'lead-1', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-4', source: 'manager-1', target: 'lead-2', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-5', source: 'lead-1', target: 'analytics-1', animated: true },
  { id: 'e4-5', source: 'lead-2', target: 'analytics-1', animated: true },
];

export function WorkflowVisualizer() {
  return (
    <div className="h-[500px] w-full glass-panel overflow-hidden border-none shadow-inner bg-slate-50/50 dark:bg-white/5">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
