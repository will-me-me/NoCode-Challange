import { defineStore } from "pinia";

export const userMainStore = defineStore("mainstore", {
  state: () => {
    return {
      panel: [0, 1],
      readonly: true,
      MembersIcons: [
        "https://i.pravatar.cc/150?img=32",
        "https://i.pravatar.cc/150?img=22",
        "https://i.pravatar.cc/150?img=60",
        "https://i.pravatar.cc/150?img=2",
      ],

      userOrbits: [],
      priorBuffer: [],
      laterBuffer: [],
      fetchDate: new Date().toISOString().slice(0, 10),
      animationDirection: "animation",
      isConnectionInfoVisible: false,
    };
  },
  actions: {
    async getApiData(date) {
      try {
        const response = await fetch(
          `https://xsrr-l2ye-dpbj.f2.xano.io/api:oUvfVMO5/receive_week?start_date=${date}`
        );
        if (!response.ok) {
          throw new console.error("failed to fetch data");
        }
        const data = await response.json();
        this.laterBuffer = data;
        this.userOrbits = data;
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
});
