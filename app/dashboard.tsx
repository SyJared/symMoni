import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Laptop,
  ListTodo,
  Plus,
  TrendingUp,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TaskStatus = "pending" | "in_progress" | "done";

interface Task {
    id: string;
    title: string;
    subtitle: string;
    status: TaskStatus;
    time: string;
}

const MOCK_TASKS: Task[] = [
    { id: "1", title: "Build API endpoint", subtitle: "Backend", status: "in_progress", time: "10 min ago" },
    { id: "2", title: "Fix quiz timer bug", subtitle: "Frontend", status: "pending", time: "1 hr ago" },
    { id: "3", title: "Deploy to server", subtitle: "DevOps", status: "done", time: "Yesterday" },
    { id: "4", title: "Write documentation", subtitle: "Docs", status: "pending", time: "2 days ago" },
];

export default function Dashboard() {
    const [tasks] = useState<Task[]>(MOCK_TASKS);

    const doneCount = tasks.filter((t) => t.status === "done").length;
    const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
    const pendingCount = tasks.filter((t) => t.status === "pending").length;

    const statusConfig = {
        done: { icon: CheckCircle2, color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "Done" },
        in_progress: { icon: Clock, color: "#6366f1", bg: "rgba(99,102,241,0.12)", label: "In Progress" },
        pending: { icon: Circle, color: "#94a3b8", bg: "rgba(148,163,184,0.12)", label: "Pending" },
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back</Text>
                        <Text style={styles.headerTitle}>Task Manager</Text>
                    </View>
                    <View style={styles.connectionBadge}>
                        <Laptop size={14} color="#22c55e" />
                        <Text style={styles.connectionText}>Connected</Text>
                    </View>
                </View>

                {/* Stats row */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: "rgba(99,102,241,0.1)" }]}>
                        <Clock size={18} color="#6366f1" />
                        <Text style={styles.statNumber}>{inProgressCount}</Text>
                        <Text style={styles.statLabel}>In Progress</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: "rgba(148,163,184,0.1)" }]}>
                        <ListTodo size={18} color="#94a3b8" />
                        <Text style={styles.statNumber}>{pendingCount}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: "rgba(34,197,94,0.1)" }]}>
                        <CheckCircle2 size={18} color="#22c55e" />
                        <Text style={styles.statNumber}>{doneCount}</Text>
                        <Text style={styles.statLabel}>Done</Text>
                    </View>
                </View>

                {/* Progress summary */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <TrendingUp size={16} color="#6366f1" />
                        <Text style={styles.progressTitle}>Today's Progress</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${(doneCount / tasks.length) * 100}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressSubtext}>
                        {doneCount} of {tasks.length} tasks completed
                    </Text>
                </View>

                {/* Task list */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Tasks</Text>
                    <TouchableOpacity style={styles.seeAllButton}>
                        <Text style={styles.seeAllText}>See all</Text>
                        <ChevronRight size={14} color="#6366f1" />
                    </TouchableOpacity>
                </View>

                {tasks.map((task) => {
                    const config = statusConfig[task.status];
                    const StatusIcon = config.icon;
                    return (
                        <TouchableOpacity key={task.id} style={styles.taskCard} activeOpacity={0.7}>
                            <View style={[styles.taskIconWrapper, { backgroundColor: config.bg }]}>
                                <StatusIcon size={18} color={config.color} />
                            </View>
                            <View style={styles.taskInfo}>
                                <Text style={styles.taskTitle}>{task.title}</Text>
                                <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
                            </View>
                            <View style={styles.taskRight}>
                                <View style={[styles.statusPill, { backgroundColor: config.bg }]}>
                                    <Text style={[styles.statusPillText, { color: config.color }]}>
                                        {config.label}
                                    </Text>
                                </View>
                                <Text style={styles.taskTime}>{task.time}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Floating add button */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
                <Plus size={26} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
    },
    greeting: {
        color: "#94a3b8",
        fontSize: 13,
        marginBottom: 2,
    },
    headerTitle: {
        color: "#f8fafc",
        fontSize: 26,
        fontWeight: "800",
    },
    connectionBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(34,197,94,0.12)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 4,
    },
    connectionText: {
        color: "#22c55e",
        fontSize: 12,
        fontWeight: "600",
    },
    statsRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 14,
        gap: 8,
    },
    statNumber: {
        color: "#f8fafc",
        fontSize: 22,
        fontWeight: "800",
    },
    statLabel: {
        color: "#94a3b8",
        fontSize: 12,
        fontWeight: "500",
    },
    progressCard: {
        backgroundColor: "#1e293b",
        borderRadius: 18,
        padding: 18,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(148,163,184,0.1)",
    },
    progressHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    progressTitle: {
        color: "#f8fafc",
        fontSize: 14,
        fontWeight: "600",
    },
    progressBarTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(148,163,184,0.15)",
        overflow: "hidden",
        marginBottom: 10,
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#6366f1",
        borderRadius: 4,
    },
    progressSubtext: {
        color: "#94a3b8",
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    sectionTitle: {
        color: "#f8fafc",
        fontSize: 17,
        fontWeight: "700",
    },
    seeAllButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    seeAllText: {
        color: "#6366f1",
        fontSize: 13,
        fontWeight: "600",
    },
    taskCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e293b",
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(148,163,184,0.08)",
    },
    taskIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        color: "#f8fafc",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 2,
    },
    taskSubtitle: {
        color: "#94a3b8",
        fontSize: 12,
    },
    taskRight: {
        alignItems: "flex-end",
        gap: 4,
    },
    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    statusPillText: {
        fontSize: 10,
        fontWeight: "700",
    },
    taskTime: {
        color: "#64748b",
        fontSize: 10,
    },
    fab: {
        position: "absolute",
        bottom: 28,
        right: 24,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#6366f1",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
});